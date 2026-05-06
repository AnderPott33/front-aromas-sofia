import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Topbar from './components/topbar';
import Catalogo from './Pages/catalogo';
import CarritoPage from './Pages/CarritoPage';
import SobreNosotros from './Pages/SobreNosotros';

// Un componente rápido para la página de administración
const AdminPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-extrabold text-violet-950">Panel de Gestión</h1>
    <p className="text-slate-500 mt-2">Aquí irá el formulario para subir productos a Cloudinary y Neon.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* 1. Envolvemos todo con el CartProvider */}
      <CartProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
          
          {/* La Topbar ahora puede mostrar el contador del carrito */}
          <Topbar />

          <main className="flex-grow transition-all duration-300 p-4">
            <Routes>
              {/* Ruta principal: Tu tienda/catálogo */}
              <Route path="/" element={<SobreNosotros />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/carrito" element={<CarritoPage />} />

              {/* Ruta para agregar/editar productos */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Redirección automática si la ruta no existe */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Footer con estilo lila */}
          <footer className="py-8 text-center text-slate-400 text-sm border-t border-violet-50 bg-white">
            &copy; 2026 Aromas De Sofia - Santa Rita OwlSoft
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;