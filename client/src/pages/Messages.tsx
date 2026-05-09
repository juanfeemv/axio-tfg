import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Paperclip, Smile, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api, { uploadsUrl } from '../services/api';

interface UserSummary {
  _id: string;
  username: string;
  avatar?: string;
}

interface MessageItem {
  _id: string;
  text: string;
  sender: UserSummary;
  recipient: UserSummary;
  createdAt: string;
  image?: string;
}

interface ConversationItem {
  id: string;
  otherUser: UserSummary;
  lastMessage?: {
    text: string;
    createdAt: string;
    sender: string;
  };
  lastMessageAt?: string;
}

export default function Messages({ embedded = false, initialUsername }: { embedded?: boolean; initialUsername?: string }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Ref para evitar stale closure en el socket listener (siempre tiene el valor actual)
  const activeConversationIdRef = useRef<string>('');
  // Ref centinela al final de la lista (target del scroll)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Ref para saber si es la carga inicial de la conversación (scroll instantáneo)
  const isInitialLoadRef = useRef<boolean>(false);

  const currentUser = user?.username || '';
  const currentUserId = user?.id || '';
  const stateUsername = (location.state as { username?: string } | null)?.username || '';
  const targetUser = username || initialUsername || stateUsername || '';
  const panelHeight = embedded ? 'h-full' : 'h-[calc(100vh-220px)]';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emojiList = ['😀', '😂', '😍', '🥳', '😅', '😉', '😎', '😭', '🔥', '👍', '🙏', '💯'];

  const uniqueById = (items: MessageItem[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDay = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };

  // Sincronizar el ref con el estado para usarlo en el socket listener
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Scroll al fondo: instantáneo en carga inicial, smooth al recibir nuevos
  useEffect(() => {
    if (!messagesEndRef.current) return;
    const behavior = isInitialLoadRef.current ? 'instant' : 'smooth';
    messagesEndRef.current.scrollIntoView({ behavior: behavior as ScrollBehavior });
    isInitialLoadRef.current = false;
  }, [messages]);

  const loadConversations = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get('/messages/conversations');
      const data = res.data.data || [];
      setConversations(data);
      if (!targetUser && data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  useEffect(() => {
    const openConversation = async () => {
      if (!targetUser || !currentUserId) {
        setActiveConversationId('');
        setMessages([]);
        return;
      }
      try {
        setLoading(true);
        const res = await api.post('/messages/conversations', { username: targetUser });
        const convoId = res.data.data?.id as string;
        if (!convoId) return;
        setActiveConversationId(convoId);
        await loadConversations();
      } catch (error) {
        console.error('Error opening conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    openConversation();
  }, [targetUser, currentUserId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      try {
        setLoading(true);
        isInitialLoadRef.current = true; // scroll instantáneo al abrir conversación
        const res = await api.get(`/messages/${activeConversationId}`);
        setMessages(uniqueById(res.data.data || []));
        await api.post(`/messages/${activeConversationId}/read`);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // ── POLLING SILENCIOSO ──────────────────────────────────────────────────────
  // Comprueba mensajes nuevos cada 3s sin mostrar ningún loader.
  // Si el socket no entrega el mensaje (problemas de red, cloudflared, etc.)
  // el polling lo recoge en máximo 3 segundos, invisible para el usuario.
  useEffect(() => {
    if (!activeConversationId || !currentUserId) return;

    const poll = async () => {
      try {
        const res = await api.get(`/messages/${activeConversationId}`);
        const fresh = uniqueById(res.data.data || []) as MessageItem[];
        setMessages((prev) => {
          // Solo actualizar si hay mensajes nuevos (evitar re-renders innecesarios)
          if (fresh.length === prev.length) return prev;
          const prevIds = new Set(prev.map((m) => m._id));
          const hasNew = fresh.some((m) => !prevIds.has(m._id));
          if (!hasNew) return prev;
          return fresh;
        });
      } catch {
        // Si falla silenciosamente, el socket sigue como respaldo
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [activeConversationId, currentUserId]);

  // Registrar el listener de socket UNA SOLA VEZ.
  // Usamos activeConversationIdRef (ref) en vez de activeConversationId (state)
  // para evitar el stale closure que causaba que los mensajes no se actualizaran al instante.
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: { conversationId: string; message: MessageItem; fromSelf?: boolean }) => {
      // Actualizar siempre la lista de conversaciones con el último mensaje
      setConversations((prev) => {
        const existing = prev.find((conv) => conv.id === payload.conversationId);
        if (!existing) return prev;
        return [
          {
            ...existing,
            lastMessage: {
              text: payload.message.text,
              createdAt: payload.message.createdAt,
              sender: payload.message.sender._id
            },
            lastMessageAt: payload.message.createdAt
          },
          ...prev.filter((conv) => conv.id !== payload.conversationId)
        ];
      });

      // Usar el ref para comparar, así siempre tiene el ID actual sin re-registrar el listener
      if (payload.conversationId !== activeConversationIdRef.current) return;

      setMessages((prev) => {
        if (prev.some((msg) => msg._id === payload.message._id)) return prev;
        return [...prev, payload.message];
      });
    };

    socket.on('new_dm', handleNewMessage);
    return () => {
      socket.off('new_dm', handleNewMessage);
    };
  }, [socket]); // Solo depende de socket, no de activeConversationId

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId) return;
    const text = input.trim();
    setInput('');
    try {
      const formData = new FormData();
      formData.append('text', text);
      const res = await api.post(`/messages/${activeConversationId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const created = res.data.data as MessageItem;
      setMessages((prev) => uniqueById([...prev, created]));
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSend = async (file: File) => {
    if (!activeConversationId) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (input.trim()) {
        formData.append('text', input.trim());
      }
      setInput('');
      const res = await api.post(`/messages/${activeConversationId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const created = res.data.data as MessageItem;
      setMessages((prev) => uniqueById([...prev, created]));
      await loadConversations();
    } catch (error) {
      console.error('Error sending image:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUserId || !currentUser) {
    return (
      <div className={embedded ? 'flex-1 p-6' : 'min-h-screen bg-white'}>
        <div className={embedded ? '' : 'max-w-4xl mx-auto px-6 py-10'}>
          {!embedded && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
              aria-label="Volver"
              data-speech="Volver"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          )}

          <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
              <MessageCircle size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Mensajes directos</h1>
            <p className="text-slate-500 mt-3">
              Inicia sesión para enviar mensajes privados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (targetUser && targetUser === currentUser) {
    return (
      <div className={embedded ? 'flex-1 p-6' : 'min-h-screen bg-white'}>
        <div className={embedded ? '' : 'max-w-4xl mx-auto px-6 py-10'}>
          {!embedded && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
              aria-label="Volver"
              data-speech="Volver"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          )}

          <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
              <MessageCircle size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Mensajes directos</h1>
            <p className="text-slate-500 mt-3">
              Abre otro perfil y toca el icono de mensaje para iniciar una conversación privada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? 'flex-1 flex flex-col h-full' : 'min-h-screen bg-white'}>
      <div className={embedded ? 'flex-1 flex flex-col px-4 py-4 h-full' : 'max-w-6xl mx-auto px-6 py-10'}>
        {!embedded && (
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
            {targetUser ? (
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400">DM</p>
                <p className="text-lg font-semibold text-slate-800">{targetUser}</p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400">Tus mensajes</p>
                <p className="text-lg font-semibold text-slate-800">Conversaciones</p>
              </div>
            )}
          </div>
        )}
        <div className={`${embedded ? 'flex-1' : 'mt-6'} grid lg:grid-cols-[300px_1fr] gap-4 ${embedded ? 'h-full' : ''}`}>
          <div
            className={`bg-white border border-slate-200 rounded-3xl shadow-sm p-4 ${panelHeight} overflow-y-auto`}
            aria-label="Lista de conversaciones"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 px-2" data-speech="Conversaciones">
              Conversaciones
            </p>
            <div className="mt-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center text-slate-500 text-sm mt-10">
                  Aún no tienes conversaciones.
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      if (!embedded && conv.otherUser?.username) {
                        navigate(`/messages/${conv.otherUser.username}`);
                      }
                    }}
                    aria-current={activeConversationId === conv.id}
                    data-speech={`Conversación con ${conv.otherUser.username}. ${conv.lastMessage?.text || 'Sin mensajes'}`}
                    className={`w-full text-left px-3 py-3 rounded-2xl border transition ${
                      activeConversationId === conv.id
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden text-slate-700 font-bold flex items-center justify-center shrink-0">
                        {conv.otherUser.avatar ? (
                          <img
                            src={uploadsUrl(conv.otherUser.avatar)}
                            alt={`Avatar de ${conv.otherUser.username}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          conv.otherUser.username?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{conv.otherUser.username}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {conv.lastMessage?.text || 'Sin mensajes'}
                        </p>
                      </div>
                      {conv.lastMessage && conv.lastMessage.sender !== currentUserId && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col ${panelHeight} overflow-hidden relative`}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(61,145,113,0.08), transparent 40%), radial-gradient(circle at 85% 0%, rgba(35,99,138,0.08), transparent 35%)'
            }} />
            <div className="relative px-6 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden text-slate-700 font-bold flex items-center justify-center">
                  {activeConversationId && conversations.find((c) => c.id === activeConversationId)?.otherUser?.avatar ? (
                    <img
                      src={uploadsUrl(conversations.find((c) => c.id === activeConversationId)?.otherUser.avatar || '')}
                      alt={`Avatar de ${conversations.find((c) => c.id === activeConversationId)?.otherUser?.username || 'usuario'}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    conversations.find((c) => c.id === activeConversationId)?.otherUser?.username?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {conversations.find((c) => c.id === activeConversationId)?.otherUser?.username || 'Conversación'}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> Activo recientemente
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4 relative"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-busy={loading}
            >
              {loading ? (
                <div className="text-center text-slate-500 mt-10">Cargando mensajes...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Aún no hay mensajes</p>
                    <p className="text-sm text-slate-500">Escribe el primero para iniciar la conversación.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.sender?._id === currentUserId;
                  const prev = messages[index - 1];
                  const showDaySeparator = !prev || formatDay(prev.createdAt) !== formatDay(msg.createdAt);
                  return (
                    <div key={msg._id}>
                      {showDaySeparator && (
                        <div className="flex items-center gap-3 my-2">
                          <div className="h-px flex-1 bg-slate-200" />
                          <span className="text-[11px] uppercase tracking-widest text-slate-400">
                            {formatDay(msg.createdAt)}
                          </span>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>
                      )}
                      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[72%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            isMine
                              ? 'bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                          data-speech={`Mensaje de ${isMine ? 'ti' : msg.sender?.username || 'usuario'}. ${msg.text?.trim() ? msg.text.trim() : msg.image ? 'Imagen enviada' : 'Mensaje sin texto'}. ${formatTime(msg.createdAt)}`}
                        >
                          <p className="font-semibold text-xs opacity-80 mb-1">
                            {isMine ? 'Tú' : msg.sender?.username || 'Usuario'}
                          </p>
                          {msg.image ? (
                            <img
                              src={uploadsUrl(msg.image)}
                              alt="Imagen enviada"
                              className="rounded-xl mb-2 max-h-56 object-cover"
                            />
                          ) : null}
                          {msg.text && msg.text.trim() && msg.text.trim() !== '' ? (
                            <p>{msg.text}</p>
                          ) : null}
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Centinela para auto-scroll al último mensaje */}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-slate-200 px-5 py-4 flex items-center gap-3 relative">
              <button
                className="h-10 w-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center"
                aria-label="Adjuntar"
                type="button"
                onClick={handleImagePick}
              >
                <Paperclip size={16} />
              </button>
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  aria-label="Escribe tu mensaje"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-[#23638a]/15 focus:border-[#23638a] outline-none"
                  disabled={!activeConversationId}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Emoji"
                  type="button"
                  onClick={() => setShowEmoji((prev) => !prev)}
                >
                  <Smile size={16} />
                </button>
                {showEmoji && (
                  <div className="absolute right-0 bottom-14 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-48">
                    <div className="grid grid-cols-6 gap-2">
                      {emojiList.map((emoji) => (
                        <button
                          key={emoji}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                          onClick={() => {
                            setInput((prev) => `${prev}${emoji}`);
                            setShowEmoji(false);
                          }}
                          aria-label={`Emoji ${emoji}`}
                          data-speech={`Emoji ${emoji}`}
                          type="button"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSend}
                className="h-11 w-11 rounded-xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white flex items-center justify-center shadow-lg disabled:opacity-50"
                aria-label="Enviar mensaje"
                disabled={!activeConversationId}
              >
                <Send size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSend(file);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
