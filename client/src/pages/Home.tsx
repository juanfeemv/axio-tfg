import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, Gauge, MessagesSquare, UploadCloud, FileCheck2 } from 'lucide-react';
import brandLogo from '../assets/logo.png';

const faqs = [
  {
      q: '¿Qué es AXIO y para quién es?',
      a: 'AXIO es una plataforma para auditar accesibilidad y calidad visual de sitios, diseños y código. Está pensada para estudiantes, equipos de producto y creadores que quieran mejorar sus entregas rápido.'
  },
  {
      q: '¿Qué puedo analizar dentro de la plataforma?',
      a: 'Puedes analizar URLs en vivo, subir diseños (imagen o PDF) y revisar código fuente para detectar problemas de accesibilidad y buenas prácticas.'
  },
  {
      q: '¿Necesito saber programar para usar AXIO?',
      a: 'No. El flujo está pensado para usuarios no técnicos, con guías claras y resultados fáciles de entender.'
  },
  {
      q: '¿Puedo compartir mis proyectos con otros?',
      a: 'Sí. Hay una sección de comunidad donde puedes publicar proyectos, recibir feedback y puntuar aportes.'
  },
  {
      q: '¿Cómo empiezo?',
      a: 'Crea tu cuenta, inicia sesión y sube tu primer proyecto desde el dashboard en menos de un minuto.'
  }
];

const highlights = [
  {
    icon: Gauge,
    title: 'Auditoría instantánea',
    text: 'Resultados claros, puntuación y recomendaciones accionables en segundos.'
  },
  {
    icon: ShieldCheck,
    title: 'Accesibilidad real',
    text: 'Detecta contrastes, estructura y patrones que afectan la experiencia.'
  },
  {
    icon: Users,
    title: 'Comunidad activa',
    text: 'Comparte proyectos, aprende de otros y recibe feedback humano.'
  }
];

const steps = [
  {
      icon: UploadCloud,
      title: 'Sube tu proyecto',
      text: 'URL, diseño o código. AXIO se adapta a tu flujo.'
  },
  {
      icon: Zap,
      title: 'Analiza tu producto',
    text: 'Obtienes un resumen claro con issues y sugerencias.'
  },
  {
    icon: MessagesSquare,
    title: 'Mejora y comparte',
    text: 'Publica en la comunidad y mide el impacto de tus cambios.'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgba(35,99,138,0.14), transparent 35%), radial-gradient(circle at 80% 10%, rgba(61,145,113,0.18), transparent 40%), radial-gradient(circle at 10% 85%, rgba(30,82,115,0.12), transparent 38%)'
        }}
      />

      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg bg-white">
              <img src={brandLogo} alt="AXIO" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-wide">AXIO</p>
              <p className="text-xs text-slate-500">Auditoría de accesibilidad</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#3d9171] to-[#23638a] hover:from-[#338066] hover:to-[#1f577a] shadow-lg shadow-[#23638a]/25 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Bienvenido a AXIO
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Tu auditoría de accesibilidad en un solo lugar.
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              AXIO te ayuda a analizar sitios web, diseños y código, generando reportes accionables para que mejores la experiencia de tus usuarios desde el primer día.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white font-semibold shadow-lg shadow-[#23638a]/25 hover:shadow-xl transition inline-flex items-center gap-2"
              >
                Crear cuenta
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Ya tengo cuenta
              </Link>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">+120</p>
                <p className="text-sm text-slate-500">Proyectos auditados por la comunidad</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">3 tipos</p>
                <p className="text-sm text-slate-500">URL, diseño visual o código fuente</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-emerald-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-6 h-40 w-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Reporte AXIO</p>
                  <p className="text-xl font-bold text-slate-800">Auditoría de ejemplo</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#23638a] to-[#3d9171] text-white flex items-center justify-center shadow-lg">
                  <FileCheck2 size={22} />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {['Contraste y legibilidad', 'Estructura semántica', 'Buenas prácticas UI'].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} />
                    <div>
                      <p className="font-semibold text-slate-700">{item}</p>
                      <p className="text-sm text-slate-500">Estado validado con recomendaciones.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#eaf5f0] to-[#e1edf6] border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Puntuación general</p>
                <p className="text-3xl font-bold text-slate-900">88/100</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#23638a] to-[#3d9171] text-white flex items-center justify-center shadow-md mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-r from-[#f2f7f4] via-[#eef4f8] to-[#f2f7f4] rounded-3xl p-8 md:p-12 text-slate-900 relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22none%22 stroke=%22%2323638a%22 stroke-width=%220.6%22 opacity=%220.15%22%3E%3Cpath d=%27M0 20h40M20 0v40%27/%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2218%22/%3E%3C/g%3E%3C/svg%3E')" }} />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Cómo funciona</p>
              <h2 className="text-3xl font-bold mt-3">Tres pasos para mejorar tu producto</h2>
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {steps.map((step) => (
                  <div key={step.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                      <step.icon size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Preguntas frecuentes</h2>
              <p className="text-slate-500 mt-3">Respuestas rápidas para comenzar sin fricción.</p>
              <div className="mt-6 space-y-4">
                {faqs.map((item) => (
                  <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white p-5 transition">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{item.q}</span>
                      <span className="text-slate-400 group-open:rotate-45 transition">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-500">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-800">¿Listo para tu primera auditoría?</h3>
              <p className="mt-3 text-slate-500">
                Empieza con una cuenta gratis y guarda tus proyectos en un dashboard claro, con acceso rápido a reportes y comunidad.
              </p>
              <div className="mt-6 space-y-3">
                {['Dashboard visual', 'Reportes con IA', 'Comunidad y feedback'].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3d9171] to-[#23638a] text-white font-semibold shadow-lg shadow-[#23638a]/25"
                >
                  Empezar ahora
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
