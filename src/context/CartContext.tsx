import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Definimos la estructura del producto en el carrito (incluye cantidad)
interface CartItem {
    id: number;
    nombre: string;
    venta: number;
    img: string | null;
    cantidad: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (producto: any) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrecio: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Agregar al carrito
    const addToCart = (producto: any) => {
        setCart((prevCart) => {
            const existe = prevCart.find((item) => item.id === producto.id);
            if (existe) {
                return prevCart.map((item) =>
                    item.id === producto.id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            // Si es nuevo, lo agregamos con cantidad 1
            return [...prevCart, { 
                id: producto.id, 
                nombre: producto.nombre, 
                venta: Number(producto.venta), 
                img: producto.img, 
                cantidad: 1 
            }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    // Cálculos automáticos
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = cart.reduce((acc, item) => acc + (item.venta * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrecio }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};