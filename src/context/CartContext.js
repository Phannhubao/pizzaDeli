import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'pizza4ps_cart';

export const normalizeImagePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  let clean = path.replace(/^\.\.\//, '');
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  return clean;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      return [];
    }
  });

  // Đồng bộ vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [cartItems]);

  // Lắng nghe thay đổi từ các tab khác
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(Array.isArray(updated) ? updated : []);
        } catch (err) {
          console.error('Lỗi phân tích localStorage storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) return;
    const pid = product.productId ?? product.id;
    if (pid === undefined || pid === null) return;

    const pname = product.productName ?? product.name ?? 'Sản phẩm';
    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.productId ?? item.id) === pid
      );

      if (existingIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (Number(item.quantity) || 0) + qtyToAdd }
            : item
        );
      }

      const formattedProduct = {
        ...product,
        productId: pid,
        id: pid,
        productName: pname,
        name: pname,
        image: normalizeImagePath(product.image),
        quantity: qtyToAdd,
      };

      return [...prevItems, formattedProduct];
    });
  }, []);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.productId ?? item.id) !== productId)
    );
  }, []);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = useCallback((productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty < 1) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => (item.productId ?? item.id) !== productId)
      );
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.productId ?? item.id) === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  }, []);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Tổng số lượng món trong giỏ hàng (hiển thị badge real-time)
  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  // Tổng tiền đơn hàng
  const totalPrice = cartItems.reduce(
    (total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được sử dụng bên trong CartProvider');
  }
  return context;
};

export default CartContext;
