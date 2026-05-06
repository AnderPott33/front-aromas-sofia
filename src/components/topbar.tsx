import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, NavLink } from 'react-router-dom';

const Topbar = () => {
    const { searchTerm, setSearchTerm, totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil

    // Clase base para los botones de navegación
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 text-sm font-semibold rounded-2xl transition-all border ${isActive
            ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-md'
            : 'bg-[#D4AF37]/10 text-[#996515] border-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
        }`;

    // Clase para los enlaces del menú móvil
    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `block w-full px-4 py-3 text-base font-bold rounded-xl transition-all ${isActive
            ? 'bg-[#D4AF37] text-white'
            : 'text-[#996515] hover:bg-[#D4AF37]/10'
        }`;

    return (
        <nav className="bg-white border-b border-[#F3E5AB]/50 px-4 py-2.5 sticky top-0 z-50 shadow-sm">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

                {/* Logo / Brand */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white border border-[#F3E5AB] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-[#F3E5AB]/40 group-hover:bg-[#F3E5AB] transition-colors">
                        <img
                            src="/tiendaOnline.ico"
                            alt="Aromas Sofia Logo"
                            className="w-7 h-7 object-contain brightness-110"
                        />
                    </div>
                    <span className="self-center text-xl font-bold whitespace-nowrap text-black tracking-tight">
                        Aromas<span className="text-[#D4AF37]"> Sofia</span>
                    </span>
                </Link>

                {/* Buscador Central (Oculto en móvil, se podría agregar un toggle luego) */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-10">
                    <div className="relative w-full">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#996515] text-sm font-semibold rounded-2xl focus:ring-[#D4AF37] focus:border-[#D4AF37] block w-full pl-10 p-2.5 transition-all outline-none placeholder-[#D4AF37]/60"
                            placeholder="Buscar productos..."
                        />
                    </div>
                </div>

                {/* Enlaces de Navegación Desktop */}
                <div className='hidden lg:flex gap-2 mr-4'>
                    <NavLink to="/" className={navLinkClass}>
                        Sobre Nosotros
                    </NavLink>
                    <NavLink to="/catalogo" className={navLinkClass}>
                        Catálogo
                    </NavLink>
                </div>

                {/* Acciones Derecha */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Carrito */}
                    <NavLink
                        to="/carrito"
                        className={({ isActive }: { isActive: boolean }) =>
                            `relative p-2 rounded-xl transition-colors ${isActive ? 'bg-[#D4AF37]/20 text-[#996515]' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`
                        }
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] rounded-full shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </NavLink>

                    {/* Perfil de Usuario */}
                    {/*  <button className="hidden sm:flex items-center gap-2 p-1 pr-3 text-sm font-semibold text-[#996515] rounded-2xl hover:bg-[#D4AF37]/10 transition-colors border border-transparent hover:border-[#D4AF37]/30">
                            <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-[#996515]" />
                            </div>
                            <span className="hidden sm:inline">Mi Cuenta</span>
                        </button> */}

                    {/* Botón Menú Hamburguesa (Solo visible en móvil/tablet) */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Menú Desplegable Móvil */}
                {isMenuOpen && (
                    <div className="lg:hidden w-full mt-4 pb-4 space-y-2 border-t border-[#F3E5AB]/30 pt-4 animate-in slide-in-from-top duration-300">
                        <NavLink 
                            to="/" 
                            className={mobileNavLinkClass}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sobre Nosotros
                        </NavLink>
                        <NavLink 
                            to="/catalogo" 
                            className={mobileNavLinkClass}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Catálogo
                        </NavLink>
                        
                        {/* Buscador dentro del menú móvil para mejor UX */}
                        <div className="relative w-full px-2 pt-2">
                            <Search className="absolute left-5 top-5 w-5 h-5 text-[#D4AF37]" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#996515] text-sm font-semibold rounded-xl block w-full pl-12 p-3 outline-none"
                                placeholder="Buscar productos..."
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Topbar;