import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, Users, Search,
    Plus, LogOut, CheckCircle, Ban, Eye, Edit3, Loader2, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { formatarMoeda } from '../utils/Formatadores';
import ProductoFormModal from '../components/productos/ProductoFormModal';

// --- INTERFACES ---
export interface Producto {
    id?: number;
    nombre: string;
    compra: number;
    venta: number;
    img?: string;
    activo: boolean;
}

export interface PedidoItem {
    id: number;
    nombre: string;
    img: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface Pedido {
    id: number;
    cliente_nombre: string;
    cliente: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado';
    total: number;
    creado_en: string;
    items?: PedidoItem[];
}

const AdminPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Estados principales
    const [activeTab, setActiveTab] = useState<'pedidos' | 'productos'>('pedidos');
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);

    // Estados de UI
    const [searchTerm, setSearchTerm] = useState('');
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
    const [showPedidoModal, setShowPedidoModal] = useState(false);
    const [showProductoModal, setShowProductoModal] = useState(false);

    // --- CARGA DE DATOS ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPedidos, resProductos] = await Promise.all([
                axios.get(`${API_URL}/api/pedidos`),
                axios.get(`${API_URL}/api/productos`)
            ]);
            setPedidos(resPedidos.data);
            setProductos(resProductos.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- CÁLCULOS DEL DASHBOARD ---
    const stats = useMemo(() => {
        const confirmados = pedidos.filter(p => p.estado === 'confirmado');
        const pendientes = pedidos.filter(p => p.estado === 'pendiente');
        const cancelados = pedidos.filter(p => p.estado === 'cancelado');
        const facturacionTotal = confirmados.reduce((acc, curr) => acc + Number(curr.total), 0);

        return {
            total: pedidos.length,
            confirmados: confirmados.length,
            pendientes: pendientes.length,
            cancelados: cancelados.length,
            facturacionTotal
        };
    }, [pedidos]);

    // --- FILTRADO ---
    const datosFiltrados = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'pedidos') {
            return pedidos.filter(p => 
                p.cliente_nombre.toLowerCase().includes(term) || p.id.toString().includes(term)
            );
        }
        return productos.filter(p => p.nombre.toLowerCase().includes(term));
    }, [searchTerm, pedidos, productos, activeTab]);

    // --- ACCIONES ---
    const verDetallePedido = async (id: number) => {
        try {
            const res = await axios.get(`${API_URL}/api/pedidos/${id}`);
            setPedidoSeleccionado(res.data);
            setShowPedidoModal(true);
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el detalle', 'error');
        }
    };

    const cambiarEstadoPedido = async (id: number, nuevoEstado: string) => {
        try {
            await axios.put(`${API_URL}/api/pedidos/${id}/estado`, { estado: nuevoEstado });
            setShowPedidoModal(false);
            await fetchData();
            Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1000, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF7]">
            {/* SIDEBAR */}
            <aside className="w-64 bg-[#1a1405] text-white hidden lg:flex flex-col fixed h-full">
                <div className="p-8 text-center border-b border-white/5">
                    <h2 className="text-2xl font-black italic">AROMAS <span className="text-[#D4AF37]">SOFIA</span></h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mt-1 font-bold">Admin Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('pedidos')}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'pedidos' ? 'bg-[#D4AF37] shadow-lg text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        <ShoppingBag size={20} /> <span className="font-bold">Pedidos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('productos')}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'productos' ? 'bg-[#D4AF37] shadow-lg text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        <Package size={20} /> <span className="font-bold">Productos</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full px-6 py-4 text-rose-400 font-bold hover:bg-rose-400/10 rounded-2xl transition-all">
                        <LogOut size={20} /> Salir
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 lg:ml-64 p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 capitalize">Panel de {activeTab}</h1>
                        <p className="text-slate-500 font-medium">Bienvenida de nuevo, Administradora.</p>
                    </div>

                    {activeTab === 'productos' && (
                        <button
                            onClick={() => { setProductoAEditar(null); setShowProductoModal(true); }}
                            className="bg-[#D4AF37] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#996515] transition-all shadow-xl shadow-[#D4AF37]/30"
                        >
                            <Plus size={20} /> Nuevo Producto
                        </button>
                    )}
                </header>

                {/* DASHBOARD RÁPIDO (Solo en pedidos) */}
                {activeTab === 'pedidos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <div className="bg-white p-6 rounded-[2rem] border border-[#F3E5AB] shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={24}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ventas Confirmadas</p>
                                    <p className="text-xl font-black text-slate-800">{formatarMoeda(stats.facturacionTotal, 'PYG')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-[#F3E5AB] shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Loader2 size={24}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pendientes</p>
                                    <p className="text-2xl font-black text-slate-800">{stats.pendientes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-[#F3E5AB] shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CheckCircle size={24}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Confirmados</p>
                                    <p className="text-2xl font-black text-slate-800">{stats.confirmados}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-[#F3E5AB] shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><Ban size={24}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Cancelados</p>
                                    <p className="text-2xl font-black text-slate-800">{stats.cancelados}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FILTRO DE BÚSQUEDA */}
                <div className="relative max-w-xl mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Buscar en ${activeTab}...`}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-[#F3E5AB] rounded-[2rem] outline-none shadow-sm focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-[2.5rem] border border-[#F3E5AB] shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
                            <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Cargando datos...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#FDFBF7] text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-[#F3E5AB]/50">
                                <tr>
                                    {activeTab === 'pedidos' ? (
                                        <>
                                            <th className="px-8 py-6">ID Pedido</th>
                                            <th className="px-8 py-6">Cliente</th>
                                            <th className="px-8 py-6">Total</th>
                                            <th className="px-8 py-6">Estado</th>
                                            <th className="px-8 py-6 text-right">Acción</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-8 py-6">Imagen</th>
                                            <th className="px-8 py-6">Nombre</th>
                                            <th className="px-8 py-6">Venta</th>
                                            <th className="px-8 py-6">Estado</th>
                                            <th className="px-8 py-6 text-right">Acción</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3E5AB]/30">
                                {datosFiltrados.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                                        {activeTab === 'pedidos' ? (
                                            <>
                                                <td className="px-8 py-5 font-bold text-[#D4AF37]">#{item.id}</td>
                                                <td className="px-8 py-5 text-slate-800 font-bold">{item.cliente_nombre}</td>
                                                <td className="px-8 py-5 font-black text-slate-900">{formatarMoeda(item.total, 'PYG')}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                                        item.estado === 'confirmado' ? 'bg-emerald-100 text-emerald-600' :
                                                        item.estado === 'cancelado' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {item.estado}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button onClick={() => verDetallePedido(item.id)} className="p-3 bg-[#F3E5AB]/30 text-[#996515] rounded-2xl hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm">
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-8 py-5">
                                                    <img src={item.img} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F3E5AB]/50 shadow-sm" alt="" />
                                                </td>
                                                <td className="px-8 py-5 font-bold text-slate-800">{item.nombre}</td>
                                                <td className="px-8 py-5 font-black text-slate-900">{formatarMoeda(item.venta, 'PYG')}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {item.activo ? 'ACTIVO' : 'OCULTO'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => { setProductoAEditar(item); setShowProductoModal(true); }}
                                                        className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* MODAL DETALLE PEDIDO */}
            {showPedidoModal && pedidoSeleccionado && (
                <div className="fixed inset-0 bg-[#1a1405]/80 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-[#1a1405] p-10 text-white flex justify-between items-start">
                            <div>
                                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">Detalle de Orden</span>
                                <h3 className="text-4xl font-black italic mt-1">Pedido #{pedidoSeleccionado.id}</h3>
                                <p className="text-white/60 font-bold mt-2">Cliente: {pedidoSeleccionado.cliente || pedidoSeleccionado.cliente_nombre}</p>
                            </div>
                            <button onClick={() => setShowPedidoModal(false)} className="p-3 bg-white/10 rounded-full hover:bg-rose-500 transition-colors"><Plus className="rotate-45" /></button>
                        </div>
                        <div className="p-10">
                            <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                                {pedidoSeleccionado.items?.map((it, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-5 bg-[#FDFBF7] rounded-[1.5rem] border border-[#F3E5AB]/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl border border-[#F3E5AB] flex items-center justify-center font-black text-[#D4AF37]">{it.cantidad}x</div>
                                            <span className="font-bold text-slate-800">{it.nombre}</span>
                                        </div>
                                        <span className="font-black text-slate-900">{formatarMoeda(it.subtotal, 'PYG')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#F3E5AB] pt-8 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Total a Cobrar</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatarMoeda(pedidoSeleccionado.total, 'PYG')}</p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, 'cancelado')} className="flex-1 md:flex-none px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                        <Ban size={18} /> Cancelar
                                    </button>
                                    <button onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, 'confirmado')} className="flex-1 md:flex-none px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2">
                                        <CheckCircle size={18} /> Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PRODUCTO */}
            <ProductoFormModal
                isOpen={showProductoModal}
                onClose={() => setShowProductoModal(false)}
                onSuccess={fetchData}
                productoParaEditar={productoAEditar}
            />
        </div>
    );
};

export default AdminPage;