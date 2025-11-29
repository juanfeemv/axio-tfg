function App() {
  return (
    // Contenedor principal: Ocupa toda la altura (h-screen) y centra el contenido
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      
      {/* Tarjeta blanca con sombra */}
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        
        {/* Título grande y rojo */}
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Hola Axio 🚀
        </h1>
        
        {/* Texto gris pequeño */}
        <p className="text-gray-600 text-lg">
          El entorno de desarrollo ya está listo.
        </p>
        
        {/* Botón de prueba */}
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Empezar Proyecto
        </button>

      </div>
    </div>
  )
}

export default App