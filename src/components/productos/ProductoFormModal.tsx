import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Producto {
  id?: number;
  nombre: string;
  compra: number;
  venta: number;
  descripcion: String;
  img?: string;
  activo: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productoParaEditar?: Producto | null;
}

const ProductoFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, productoParaEditar }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [compra, setCompra] = useState<number>(0);
  const [venta, setVenta] = useState<number>(0);
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Cargar datos si es edición
  useEffect(() => {
    if (productoParaEditar) {
      setNombre(productoParaEditar.nombre);
      setCompra(Number(productoParaEditar.compra));
      setVenta(Number(productoParaEditar.venta));
      setDescripcion(productoParaEditar.descripcion);
      setActivo(productoParaEditar.activo);
      setPreviewUrl(productoParaEditar.img || '');
    } else {
      resetForm();
    }
  }, [productoParaEditar, isOpen]);

  const resetForm = () => {
    setNombre('');
    setCompra(0);
    setVenta(0);
    setDescripcion('');
    setActivo(true);
    setImagenFile(null);
    setPreviewUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Vista previa local
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // IMPORTANTE: Usar FormData para enviar archivos
    const formData = new FormData();
    if (productoParaEditar?.id) formData.append('id', productoParaEditar.id.toString());
    formData.append('nombre', nombre);
    formData.append('compra', compra.toString());
    formData.append('venta', venta.toString());
    formData.append('descripcion', descripcion.toString());
    formData.append('activo', activo.toString());
    if (imagenFile) formData.append('img', imagenFile); // El nombre 'img' debe coincidir con upload.single('img') en el back

    try {
      if (productoParaEditar) {
        await axios.put(`${API_URL}/api/productos/editar`, formData);
      } else {
        await axios.post(`${API_URL}/api/productos/nuevo`, formData);
      }

      Swal.fire({
        icon: 'success',
        title: `Producto ${productoParaEditar ? 'actualizado' : 'creado'}`,
        showConfirmButton: false,
        timer: 1500
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#1a1405] p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {productoParaEditar ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Subida de Imagen */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#F3E5AB] rounded-3xl p-4 bg-[#FDFBF7] transition-all hover:border-[#D4AF37]">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-2xl mb-2 shadow-md" />
            ) : (
              <Upload className="w-10 h-10 text-[#D4AF37] mb-2" />
            )}
            <label className="cursor-pointer bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#996515] transition-colors">
              {previewUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Nombre del Producto</label>
              <input
                required
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-5 py-3 bg-[#FDFBF7] border border-[#F3E5AB] rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                placeholder="Ej: Vela Vainilla"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Descripción del Producto</label>
              <input
                required
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-5 py-3 bg-[#FDFBF7] border border-[#F3E5AB] rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                placeholder="Ej: Vela Vainilla"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Precio Compra</label>
                <input
                  required
                  type="number"
                  value={compra}
                  onChange={(e) => setCompra(Number(e.target.value))}
                  className="w-full px-5 py-3 bg-[#FDFBF7] border border-[#F3E5AB] rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Precio Venta</label>
                <input
                  required
                  type="number"
                  value={venta}
                  onChange={(e) => setVenta(Number(e.target.value))}
                  className="w-full px-5 py-3 bg-[#FDFBF7] border border-[#F3E5AB] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-2">
              <input
                type="checkbox"
                id="activo"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-5 h-5 accent-[#D4AF37]"
              />
              <label htmlFor="activo" className="text-sm font-bold text-slate-700 cursor-pointer">
                Producto visible en la tienda
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1405] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a2108] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {productoParaEditar ? 'Guardar Cambios' : 'Registrar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductoFormModal;