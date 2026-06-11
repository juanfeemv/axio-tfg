import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, Gauge,
  MessagesSquare, UploadCloud, FileCheck2, ChevronDown
} from 'lucide-react';
import brandLogo from '../assets/logo.png';

/* ── Datos ── */
const faqs = [
  { q: '¿Qué es AXIO y para quién es?', a: 'AXIO es una plataforma para auditar accesibilidad y calidad visual de sitios, diseños y código. Está pensada para estudiantes, equipos de producto y creadores que quieran mejorar sus entregas rápido.' },
  { q: '¿Qué puedo analizar dentro de la plataforma?', a: 'Puedes analizar URLs en vivo, subir diseños (imagen o PDF) y revisar código fuente para detectar problemas de accesibilidad y buenas prácticas.' },
  { q: '¿Necesito saber programar para usar AXIO?', a: 'No. El flujo está pensado para usuarios no técnicos, con guías claras y resultados fáciles de entender.' },
  { q: '¿Puedo compartir mis proyectos con otros?', a: 'Sí. Hay una sección de comunidad donde puedes publicar proyectos, recibir feedback y puntuar aportes.' },
  { q: '¿Cómo empiezo?', a: 'Crea tu cuenta, inicia sesión y sube tu primer proyecto desde el dashboard en menos de un minuto.' },
];

const highlights = [
  { icon: Gauge,      title: 'Auditoría instantánea', text: 'Resultados claros, puntuación y recomendaciones accionables en segundos.' },
  { icon: ShieldCheck,title: 'Accesibilidad real',    text: 'Detecta contrastes, estructura y patrones que afectan la experiencia.' },
  { icon: Users,      title: 'Comunidad activa',      text: 'Comparte proyectos, aprende de otros y recibe feedback humano.' },
];

const steps = [
  { icon: UploadCloud,   title: 'Sube tu proyecto',   text: 'URL, diseño o código. AXIO se adapta a tu flujo.' },
  { icon: Zap,           title: 'Analiza tu producto', text: 'Obtienes un resumen claro con issues y sugerencias.' },
  { icon: MessagesSquare,title: 'Mejora y comparte',   text: 'Publica en la comunidad y mide el impacto de tus cambios.' },
];

/* ── Hook scroll-reveal ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-slate-200 bg-white rounded-2xl overflow-hidden transition-shadow shadow-sm hover:shadow-md"
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 text-sm pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`faq-body ${open ? 'open' : ''}`}>
        <div className="faq-inner">
          <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 40);
        if (start >= target) { setVal(target); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Home() {
  useReveal();
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden">

      {/* ── NAV STICKY ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navSolid ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/70' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl overflow-hidden shadow-lg bg-white border border-slate-100">
              <img src={brandLogo} alt="AXIO" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-wide">AXIO</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition">
              Iniciar sesión
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#3d9171] to-[#23638a] shadow-lg shadow-[#23638a]/20 hover:shadow-xl hover:scale-[1.03] transition-all">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">

        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 px-4 md:px-6 overflow-hidden">
          {/* Blobs de fondo con gradiente animado */}
          <div className="absolute inset-0 animate-gradient-bg opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(61,145,113,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(35,99,138,0.15), transparent 50%)' }} />
          <div className="absolute top-10 left-[10%] h-72 w-72 bg-emerald-400/20 rounded-full blur-3xl animate-float pointer-events-none" />
          <div className="absolute top-24 right-[8%] h-64 w-64 bg-blue-400/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-[60%] bg-gradient-to-r from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl pointer-events-none" />
          
          {/* Partículas flotantes */}
          {[...Array(8)].map((_, i) => <div key={i} className="particle" />)}

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Texto */}
            <div className="reveal-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-50 to-blue-50 border border-slate-200 px-4 py-1.5 rounded-full text-slate-600 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Bienvenido a AXIO
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Tu auditoría de{' '}
                <span className="bg-gradient-to-r from-[#3d9171] via-[#23638a] to-[#3d9171] bg-clip-text text-transparent animate-shimmer">
                  accesibilidad
                </span>{' '}
                en un solo lugar.
              </h1>

              <p className="mt-5 text-lg text-slate-500 max-w-xl leading-relaxed">
                AXIO analiza sitios web, diseños y código — generando reportes accionables para que mejores la experiencia de tus usuarios desde el primer día.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white font-semibold shadow-xl shadow-[#23638a]/25 hover:shadow-2xl hover:scale-[1.04] active:scale-[0.98] transition-all">
                  Crear cuenta gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all">
                  Ya tengo cuenta
                </Link>
              </div>

              {/* Stats animadas */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <p className="text-2xl font-extrabold text-slate-800">
                    +<Counter target={120} />
                  </p>
                  <p className="text-sm text-slate-500">Proyectos auditados</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <p className="text-2xl font-extrabold text-slate-800">
                    <Counter target={3} /> tipos
                  </p>
                  <p className="text-sm text-slate-500">URL, diseño o código</p>
                </div>
              </div>
            </div>

            {/* Mock card flotante */}
            <div className="reveal-right relative">
              <div className="absolute -top-8 -right-8 h-36 w-36 bg-emerald-400/25 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-12 -left-8 h-44 w-44 bg-blue-400/25 rounded-full blur-3xl animate-float-slow" />

              <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl tilt-glow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Reporte AXIO</p>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">Auditoría de ejemplo</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#23638a] to-[#3d9171] text-white flex items-center justify-center shadow-lg">
                    <FileCheck2 size={22} />
                  </div>
                </div>
                <div className="space-y-3">
                  {['Contraste y legibilidad', 'Estructura semántica', 'Buenas prácticas UI'].map((item, i) => (
                    <div key={item} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                      <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={17} />
                      <div>
                        <p className="font-semibold text-slate-700 text-sm">{item}</p>
                        <p className="text-xs text-slate-400">Validado · {85 + i * 4}% OK</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#eaf5f0] to-[#e1edf6] border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Puntuación global</p>
                    <p className="text-3xl font-extrabold text-slate-900">88<span className="text-base text-slate-400">/100</span></p>
                  </div>
                  {/* Mini gauge */}
                  <svg className="h-14 w-14" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#g)" strokeWidth="3"
                      strokeDasharray="88 12" strokeDashoffset="25" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3d9171" />
                        <stop offset="100%" stopColor="#23638a" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HIGHLIGHTS ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <div
                key={item.title}
                className="reveal group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#23638a] to-[#3d9171] text-white flex items-center justify-center shadow-md mb-4 icon-pop">
                  <item.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-14 relative overflow-hidden">
            {/* Rejilla decorativa */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0H0v40' stroke='%23fff' stroke-width='.4'/%3E%3C/svg%3E\")" }} />
            <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float" />

            <div className="relative reveal text-center mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-[.3em] text-emerald-400 mb-3">Cómo funciona</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Tres pasos para mejorar tu producto</h2>
            </div>

            <div className="relative grid md:grid-cols-3 gap-6">
              {/* Línea conectora */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#23638a] text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 icon-pop">
                    <step.icon size={20} />
                  </div>
                  <span className="absolute top-5 right-5 text-4xl font-black text-white/5 select-none">{i + 1}</span>
                  <h3 className="font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs + CTA ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* FAQs */}
            <div>
              <div className="reveal mb-6">
                <span className="text-xs font-bold uppercase tracking-[.3em] text-emerald-600">FAQ</span>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Preguntas frecuentes</h2>
                <p className="text-slate-500 mt-2">Respuestas rápidas para comenzar sin fricción.</p>
              </div>
              <div className="space-y-3">
                {faqs.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="reveal-right sticky top-28">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden animate-border">
                <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/15 rounded-full blur-2xl animate-float pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-500/15 rounded-full blur-2xl animate-float-slow pointer-events-none" />

                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gratis para empezar
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mb-3">¿Listo para tu primera auditoría?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Empieza con una cuenta gratis y guarda tus proyectos en un dashboard claro, con acceso rápido a reportes y comunidad.
                  </p>

                  <div className="space-y-2.5 mb-7">
                    {['Dashboard visual con reportes IA', 'Comunidad con feedback real', 'Motor de empatía visual'].map(point => (
                      <div key={point} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        {point}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/register" className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.04] transition-all">
                      Empezar ahora
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 font-semibold hover:bg-white/10 transition-all">
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-100 py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-slate-400">
            <img src={brandLogo} alt="AXIO" className="h-6 w-6 rounded-lg" />
            <span className="font-bold text-slate-700">AXIO</span>
            <span>· Auditoría de accesibilidad</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
