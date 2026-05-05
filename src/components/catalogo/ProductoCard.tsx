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
    img: string | null;
    activo: boolean;
};

const ProductoCard = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);

    // 1. Extraer addToCart y searchTerm del contexto
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

    // 2. Lógica de filtrado: Filtramos la lista original basándonos en el searchTerm
    const productosFiltrados = productos.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (cargando) return (
        <div className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-violet-600 font-medium">Cargando catálogo...</p>
        </div>
    );

    // 3. Si no hay productos que coincidan con la búsqueda
    if (productosFiltrados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center w-full col-span-full">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <SearchX className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No encontramos resultados</h3>
                <p className="text-slate-500 mt-2">No hay productos que coincidan con "{searchTerm}"</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {/* 4. Mapeamos los productos ya filtrados */}
            {productosFiltrados.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-[2.5rem] p-4 border border-violet-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 group"
                >
                    {/* Contenedor de Imagen */}
                    <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-violet-50">
                        <img
                            src={item.img && item.img.trim() !== ""
                                ? item.img
                                : 'https://placehold.co/300x300/f5f3ff/7c3aed?text=Sin+Imagen'}
                            alt={item.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {item.activo && (
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-violet-600 uppercase tracking-wider shadow-sm">
                                Disponible
                            </div>
                        )}
                    </div>

                    {/* Información del Producto */}
                    <div className="mt-4 px-2">
                        <h3 className="text-slate-800 font-bold text-lg leading-tight group-hover:text-violet-600 transition-colors">
                            {item.nombre}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">Disponibilidad inmediata</p>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-medium">Precio</span>
                                <span className="text-2xl font-black text-slate-900">
                                    {formatarMoeda(Number(item.venta), 'PYG')}
                                </span>
                            </div>

                            <button 
                                onClick={() => addToCart(item)}
                                className="bg-violet-600 text-white p-3 rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 active:scale-90 transition-all transform hover:-translate-y-1"
                                title="Agregar al carrito"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductoCard;