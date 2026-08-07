import { createContext, useContext, useEffect, useState } from "react";

const FavCtx = createContext(null);

export function FavProvider({ children }) {
  const [favs, setFavs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("iberia.favs") || "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem("iberia.favs", JSON.stringify([...favs]));
  }, [favs]);

  const toggle = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const has = (id) => favs.has(id);

  return (
    <FavCtx.Provider value={{ favs, toggle, has }}>{children}</FavCtx.Provider>
  );
}

export const useFav = () => useContext(FavCtx);
