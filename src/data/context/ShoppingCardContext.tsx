import { useState, ReactNode, createContext, useContext } from "react";
import { ShoppingCart } from "../../components/ShoppingCart";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type shoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  cartItems: CartItem[];
  cartQuantity: number;
  closeCart: () => void;
  openCart: () => void; // takes nothing an returns void
  getItemQuantity: (id: number) => number; // takes nothing a number and returns a number
  increaseCartQuantity: (id: number) => void; // takes nothing a number and returns void
  decreaseCartQuantity: (id: number) => void; // takes nothing a number and returns void
  removeFromCart: (id: number) => void; // takes nothing a number and returns void
};

const ShoppingCardContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCardContext);
}

export function ShoppingCartProvider({ children }: shoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id) == null) {
        return [...currentItems, { id, quantity: 1 }];
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id)?.quantity == 1) {
        return currentItems.filter((item) => item.id !== id);
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems(() => {
      return cartItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCardContext.Provider
      value={{
        increaseCartQuantity,
        removeFromCart,
        decreaseCartQuantity,
        getItemQuantity,
        openCart,
        closeCart,
        cartQuantity,
        cartItems,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCardContext.Provider>
  );
}
