import React from 'react';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext'; // 1. Importar el hook
import { Link } from 'react-router-dom';

const Topbar = () => {
    const { searchTerm, setSearchTerm } = useCart();
    // 2. Extraer totalItems del contexto
    const { totalItems } = useCart();

    return (
        <nav className="bg-white border-b border-purple-100 px-4 py-2.5 sticky top-0 z-50 shadow-sm">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

                {/* Logo / Brand */}
                <a href="/" className="flex items-center gap-2 group">
                    {/* Contenedor lila con brillo sutil para resaltar el dorado */}
                    <div className="bg-violet-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 group-hover:bg-violet-700 transition-colors">
                        <img
                            /* IMPORTANTE: En Vite, los archivos en 'public' se acceden con '/' directamente */
                            src="/tiendaOnline.ico"
                            alt="Aromas Sofia Logo"
                            className="w-7 h-7 object-contain brightness-110"
                        />
                    </div>

                    {/* Texto del nombre de la tienda */}
                    <span className="self-center text-xl font-bold whitespace-nowrap text-violet-950 tracking-tight">
                        Aromas<span className="text-violet-600"> Sofia</span>
                    </span>
                </a>

                {/* Buscador Central */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-10">
                    <div className="relative w-full">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-violet-400" />
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            className="bg-violet-50 border border-violet-100 text-violet-900 text-sm rounded-2xl focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 p-2.5 transition-all outline-none"
                            placeholder="Buscar productos..."
                        />
                    </div>
                </div>

                {/* Acciones Derecha */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Carrito con Badge Real */}
                    <Link
                        to="/carrito"
                        className="relative p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-violet-500 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Perfil de Usuario */}
                    <button className="flex items-center gap-2 p-1 pr-3 text-sm font-medium text-violet-900 rounded-2xl hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-100">
                        <div className="w-8 h-8 bg-violet-200 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-violet-700" />
                        </div>
                        <span className="hidden sm:inline">Mi Cuenta</span>
                    </button>

                    {/* Menú Mobile */}
                    <button className="md:hidden p-2 text-violet-600 hover:bg-violet-50 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Topbar;