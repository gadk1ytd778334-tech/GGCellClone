import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, GRADIENTS } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function SuccessScreen({ route, navigation }) {
  const total = route.params?.total || 0;

  // Анимации
  const scale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const confetti = useRef(
    Array.from({ length: 12 }).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: ['#7c3aed', '#a855f7', '#f59e0b', '#10b981', '#ef4444'][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 8,
    }))
  ).current;

  useEffect(() => {
    // 1. Появление круга
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();

    // 2. Появление галочки
    Animated.timing(checkOpacity, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // 3. Появление текста
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 400,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // 4. Конфетти
    confetti.forEach((p, i) => {
      const angle = (Math.PI * 2 * i) / confetti.length;
      const distance = 100 + Math.random() * 80;
      Animated.parallel([
        Animated.timing(p.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1200,
          delay: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: Math.sin(angle) * distance,
          duration: 1200,
          delay: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 1200,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <LinearGradient colors={GRADIENTS.dark} style={styles.c}>
      {/* Конфетти */}
      {confetti.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
        />
      ))}

      {/* Круг с галочкой */}
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Animated.View style={{ opacity: checkOpacity }}>
          <Icon name="checkmark" size={80} color="#fff" />
        </Animated.View>
      </Animated.View>

      {/* Текст и кнопки */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Text style={styles.title}>Оплата прошла!</Text>
        <Text style={styles.subtitle}>
          Спасибо за покупку{total ? ` на ${total} ₽` : ''}.{'\n'}
          Проверьте email — данные для входа уже там.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
        >
          <LinearGradient colors={GRADIENTS.primary} style={styles.btnGrad}>
            <Icon name="receipt-outline" size={20} color="#fff" />
            <Text style={styles.btnT}>К моим заказам</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
        >
          <Text style={styles.secondaryT}>На главную</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  c: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: 12,
  },
  btnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnT: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    paddingVertical: 14,
  },
  secondaryT: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  confetti: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -6,
  },
});
