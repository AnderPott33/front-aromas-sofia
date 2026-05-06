import React, { useEffect, useState } from 'react';
import { formatarMoeda } from '../../utils/Formatadores';
import { Plus, SearchX } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

interface Producto {
    id: number;
    nombre: string;
    compra: number;
    venta: number;
    descripcion: string;
    img: string | null;
    activo: boolean;
};

const ProductoCard = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);

    const { addToCart, searchTerm } = useCart();

    const buscarProductos = async () => {
        try {
            const result = await axios.get(`${API_URL}/api/productos`);
            setProductos(result.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        buscarProductos();
    }, []);

    const productosActivos = productos.filter(p=> p.activo);

    const productosFiltrados = productosActivos.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loader con tonos dorados
    if (cargando) return (
        <div className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mb-4"></div>
            <p className="text-[#996515] font-medium">Cargando catálogo...</p>
        </div>
    );

    // Estado vacío con tonos arena/dorado suave
    if (productosFiltrados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center w-full col-span-full">
                <div className="bg-[#F3E5AB]/20 p-6 rounded-full mb-4">
                    <SearchX className="w-12 h-12 text-[#D4AF37]/50" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No encontramos resultados</h3>
                <p className="text-slate-500 mt-2">No hay productos que coincidan con "{searchTerm}"</p>
            </div>
        );
    }

    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
    {productosFiltrados.map((item) => (
        <div
            key={item.id}
            className="group relative bg-white rounded-[2.5rem] p-3 border border-[#F3E5AB]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 ease-out"
        >
            {/* Contenedor de Imagen y Descripción Flotante */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#FDFBF7]">
                <img
                    src={item.img && item.img.trim() !== ""
                        ? item.img
                        : 'https://placehold.co/400x500/FDFBF7/D4AF37?text=Aromas+Sofia'}
                    alt={item.nombre}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                
                {/* Overlay que aparece en Hover para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="text-slate-800 text-sm leading-relaxed font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {item.descripcion}
                    </p>
                </div>

                {item.activo && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-[#F3E5AB]/50 z-10">
                        <p className="text-[10px] font-black text-[#996515] uppercase tracking-[0.15em]">
                            Disponible
                        </p>
                    </div>
                )}
            </div>

            {/* Información Inferior (Estática, nunca se tapa) */}
            <div className="mt-5 px-3 pb-4">
                <div className="mb-4">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Fragancia Exclusiva</p>
                    <h3 className="text-slate-900 font-black text-xl leading-tight truncate">
                        {item.nombre}
                    </h3>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Inversión</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                            {formatarMoeda(Number(item.venta), 'PYG')}
                        </span>
                    </div>

                    <button 
                        onClick={() => addToCart(item)}
                        className="relative z-30 bg-[#1a1405] text-white p-4 rounded-2xl hover:bg-[#D4AF37] shadow-xl shadow-[#1a1405]/10 hover:shadow-[#D4AF37]/30 transition-all duration-300 group/btn active:scale-90"
                    >
                        <Plus className="w-6 h-6 transform group-hover/btn:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    ))}
</div>
    );
};

export default ProductoCard;