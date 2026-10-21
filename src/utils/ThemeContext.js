import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_COLORS, LIGHT_COLORS, GRADIENTS } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved === 'light' || saved === 'dark') setMode(saved);
    });
  }, []);

  const toggleTheme = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await AsyncStorage.setItem('theme', next);
  };

  const colors = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  // Градиент "dark" для светлой темы лучше заменить на светлый
  const gradients =
    mode === 'dark'
      ? GRADIENTS
      : {
          ...GRADIENTS,
          dark: ['#eef0f5', '#f5f6fa'],
        };

  return (
    <ThemeContext.Provider value={{ mode, colors, gradients, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
