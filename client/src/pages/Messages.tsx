import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Trash2 } from 'lucide-react';
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

export default function Messages({ embedded = false }: { embedded?: boolean }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const currentUser = user?.username || '';
  const currentUserId = user?.id || '';
  const targetUser = username || '';

  const loadConversations = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.data || []);
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
        const res = await api.get(`/messages/${activeConversationId}`);
        setMessages(res.data.data || []);
        await api.post(`/messages/${activeConversationId}/read`);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: { conversationId: string; message: MessageItem }) => {
      setConversations((prev) => {
        const existing = prev.find((conv) => conv.id === payload.conversationId);
        if (!existing) return prev;
        const updated = [
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
        return updated;
      });

      if (payload.conversationId !== activeConversationId) return;
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === payload.message._id)) return prev;
        return [...prev, payload.message];
      });
    };

    socket.on('new_dm', handleNewMessage);
    return () => {
      socket.off('new_dm', handleNewMessage);
    };
  }, [socket, activeConversationId]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId) return;
    const text = input.trim();
    setInput('');
    try {
      const res = await api.post(`/messages/${activeConversationId}`, {
        text
      });
      const created = res.data.data as MessageItem;
      // Only add if the socket event hasn't already added it (deduplication)
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === created._id)) return prev;
        return [...prev, created];
      });
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await api.delete(`/messages/${convId}`);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversationId === convId) {
        setActiveConversationId('');
        setMessages([]);
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setConfirmDeleteId(null);
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
              Inicia sesion para enviar mensajes privados.
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
              Abre otro perfil y toca el icono de mensaje para iniciar una conversacion privada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 h-[70vh] overflow-y-auto">
            <p className="text-xs uppercase tracking-widest text-slate-400 px-2">Conversaciones</p>
            <div className="mt-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center text-slate-500 text-sm mt-10">
                  Aun no tienes conversaciones.
                </div>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      onClick={() => navigate(`/messages/${conv.otherUser.username}`)}
                      className={`w-full text-left px-3 py-3 rounded-2xl border transition ${
                        activeConversationId === conv.id
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden text-slate-700 font-bold flex items-center justify-center shrink-0">
                          {conv.otherUser.avatar ? (
                            <img src={uploadsUrl(conv.otherUser.avatar)} alt={conv.otherUser.username} className="h-full w-full object-cover" />
                          ) : (
                            conv.otherUser.username?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p className="font-semibold text-sm text-slate-800 truncate">{conv.otherUser.username}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {conv.lastMessage?.text || 'Sin mensajes'}
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(conv.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"
                      aria-label="Eliminar conversación"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center text-slate-500 mt-10">Cargando mensajes...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                  Aun no hay mensajes. Escribe el primero para iniciar la conversacion.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender?._id === currentUserId;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          isMine
                            ? 'bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <p className="font-semibold text-xs opacity-80 mb-1">
                          {isMine ? 'Tu' : msg.sender?.username || 'Usuario'}
                        </p>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-slate-200 p-4 flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-[#23638a]/15 focus:border-[#23638a] outline-none"
                disabled={!activeConversationId}
              />
              <button
                onClick={handleSend}
                className="h-11 w-11 rounded-xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white flex items-center justify-center shadow-lg disabled:opacity-50"
                aria-label="Enviar mensaje"
                disabled={!activeConversationId}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal de confirmación de borrado */}
    {confirmDeleteId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <Trash2 size={22} />
          </div>
          <p className="text-slate-800 font-semibold text-center">¿Eliminar esta conversación?</p>
          <p className="text-slate-500 text-sm text-center">Se borrarán todos los mensajes de forma permanente.</p>
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteConversation(confirmDeleteId)}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition font-semibold"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
