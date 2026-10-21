import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then((saved) => {
      if (saved) setFavorites(JSON.parse(saved));
    });
  }, []);

  const save = async (next) => {
    setFavorites(next);
    await AsyncStorage.setItem('favorites', JSON.stringify(next));
  };

  const toggleFavorite = async (item) => {
    const exists = favorites.find((f) => f.id === item.id);
    if (exists) {
      await save(favorites.filter((f) => f.id !== item.id));
    } else {
      await save([item, ...favorites]);
    }
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
