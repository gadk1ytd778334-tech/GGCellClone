import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1500);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        
        const savedBalance = await AsyncStorage.getItem('balance');
        if (savedBalance) setBalance(Number(savedBalance));
        
        const savedOrders = await AsyncStorage.getItem('orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.log('Ошибка загрузки данных:', e);
      }
    };
    loadData();
  }, []);

  const saveBalance = async (newBal) => {
    setBalance(newBal);
    await AsyncStorage.setItem('balance', String(newBal));
    console.log('Баланс обновлен:', newBal);
  };

  const login = async (email) => {
    const u = { email, name: email.split('@')[0], id: Date.now() };
    setUser(u);
    await AsyncStorage.setItem('user', JSON.stringify(u));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const addOrder = async (order) => {
    console.log('Добавляем заказ:', order);
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, balance, setBalance: saveBalance, orders, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
