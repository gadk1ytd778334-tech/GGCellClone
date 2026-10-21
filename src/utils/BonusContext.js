import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BonusContext = createContext();

const today = () => new Date().toDateString();

export const BonusProvider = ({ children }) => {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [wheelClaimed, setWheelClaimed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('dailyBonusDate'),
      AsyncStorage.getItem('wheelDate'),
    ]).then(([daily, wheel]) => {
      setDailyClaimed(daily === today());
      setWheelClaimed(wheel === today());
      setLoading(false);
    });
  }, []);

  const claimDaily = async () => {
    if (dailyClaimed) return false;
    setDailyClaimed(true);
    await AsyncStorage.setItem('dailyBonusDate', today());
    return true;
  };

  const claimWheel = async () => {
    if (wheelClaimed) return false;
    setWheelClaimed(true);
    await AsyncStorage.setItem('wheelDate', today());
    return true;
  };

  return (
    <BonusContext.Provider value={{ dailyClaimed, wheelClaimed, loading, claimDaily, claimWheel }}>
      {children}
    </BonusContext.Provider>
  );
};

export const useBonus = () => useContext(BonusContext);
