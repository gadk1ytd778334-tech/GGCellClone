import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../utils/AuthContext';
import { useBonus } from '../utils/BonusContext';
import { useTheme } from '../utils/ThemeContext';
import { GRADIENTS } from '../utils/theme';

const { width } = Dimensions.get('window');

// Призы — просто список. Колесо будем делить на 6 секторов.
const PRIZES = [
  { id: 1, label: '50 ₽', value: 50, color: '#7c3aed' },
  { id: 2, label: '100 ₽', value: 100, color: '#a855f7' },
  { id: 3, label: '0 ₽', value: 0, color: '#2a2f4a' },
  { id: 4, label: '200 ₽', value: 200, color: '#f59e0b' },
  { id: 5, label: '20 ₽', value: 20, color: '#10b981' },
  { id: 6, label: '500 ₽', value: 500, color: '#ef4444' },
];

export default function WheelScreen({ navigation }) {
  const { balance, setBalance } = useAuth();
  const { wheelClaimed, claimWheel } = useBonus();
  const { colors } = useTheme();

  const rotate = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const styles = makeStyles(colors);

  const spin = () => {
    if (spinning || wheelClaimed) return;
    setSpinning(true);
    setResult(null);

    // Выбираем случайный приз с шансами (0 ₽ — чаще)
    const weights = [30, 25, 20, 15, 7, 3]; // 0 ₽ чаще всех
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    let index = 0;
    for (let i = 0; i < weights.length; i++) {
      if (r < weights[i]) { index = i; break; }
      r -= weights[i];
    }

    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 оборотов
    const sectorAngle = 360 / PRIZES.length;
    const targetAngle = spins * 360 + index * sectorAngle;

    Animated.timing(rotate, {
      toValue: targetAngle,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      const prize = PRIZES[index];
      setResult(prize);
      setSpinning(false);
      if (prize.value > 0) {
        setBalance(balance + prize.value);
        Toast.show({ type: 'success', text1: `Вы выиграли ${prize.label}!`, text2: 'Зачислено на баланс' });
      } else {
        Toast.show({ type: 'info', text1: 'Пусто!', text2: 'Попробуйте завтра' });
      }
      await claimWheel();
    });
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.c}>
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headT}>Колесо фортуны</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.wheelWrap}>
        <Animated.View style={[styles.wheel, { transform: [{ rotate: rotateInterpolate }] }]}>
          {PRIZES.map((p, i) => (
            <View
              key={p.id}
              style={[
                styles.sector,
                {
                  backgroundColor: p.color,
                  transform: [{ rotate: `${i * (360 / PRIZES.length)}deg` }],
                },
              ]}
            >
              <Text style={styles.sectorText}>{p.label}</Text>
            </View>
          ))}
        </Animated.View>
        <View style={styles.centerCircle}>
          <Text style={{ fontSize: 28 }}>🎡</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.balanceLabel}>Ваш баланс</Text>
        <Text style={styles.balanceValue}>{balance} ₽</Text>
      </View>

      {wheelClaimed ? (
        <View style={styles.doneBtn}>
          <Icon name="checkmark-circle" size={22} color={colors.success} />
          <Text style={styles.doneText}>Вы уже крутили сегодня. Возвращайтесь завтра!</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={spin} disabled={spinning} activeOpacity={0.85} style={{ width: '100%' }}>
          <LinearGradient colors={GRADIENTS.gold} style={styles.spinBtn}>
            <Text style={styles.spinT}>{spinning ? 'Крутится...' : 'Крутить колесо'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const makeStyles = (C) => StyleSheet.create({
  c: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 24 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  headT: { color: C.text, fontSize: 18, fontWeight: '600' },

  wheelWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
  wheel: {
    width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 6, borderColor: '#fff',
    overflow: 'hidden',
  },
  sector: {
    position: 'absolute',
    width: width * 0.8, height: width * 0.4,
    top: 0, left: 0,
    alignItems: 'center', paddingTop: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectorText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  centerCircle: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10,
  },

  infoBox: { alignItems: 'center', marginBottom: 20 },
  balanceLabel: { color: C.textMuted, fontSize: 13 },
  balanceValue: { color: C.accent, fontSize: 28, fontWeight: 'bold', marginTop: 4 },

  spinBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  spinT: { color: '#fff', fontSize: 16, fontWeight: '700' },

  doneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1, borderColor: C.success,
  },
  doneText: { color: C.success, fontSize: 13, textAlign: 'center', flex: 1 },
});
