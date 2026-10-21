import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { findPromocode, applyDiscount } from '../data/promocodes';
import { GRADIENTS } from '../utils/theme';

const METHODS = [
  { id: 'balance', name: 'Баланс GGCELL', icon: 'wallet' },
  { id: 'card', name: 'Банковская карта', icon: 'card' },
  { id: 'sbp', name: 'СБП', icon: 'flash' },
];

export default function CheckoutScreen({ navigation }) {
  const { cart, totalPrice, clearCart } = useCart();
  const { balance, setBalance, addOrder } = useAuth();
  const { colors } = useTheme();

  const [method, setMethod] = useState('balance');
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  const styles = makeStyles(colors);
  const finalTotal = Math.max(0, totalPrice - discount);

  const handleApplyPromo = () => {
    const found = findPromocode(promoInput);
    if (!found) {
      Toast.show({ type: 'error', text1: 'Промокод не найден', text2: `«${promoInput}» не существует` });
      return;
    }
    const d = applyDiscount(totalPrice, found, cart);
    if (d === 0) {
      Toast.show({ type: 'error', text1: 'Промокод не подходит', text2: 'Проверьте условия' });
      return;
    }
    setPromo(found);
    setDiscount(d);
    Toast.show({ type: 'success', text1: 'Промокод применён!', text2: `Скидка −${d} ₽` });
  };

  const handleRemovePromo = () => {
    setPromo(null);
    setDiscount(0);
    setPromoInput('');
    Toast.show({ type: 'info', text1: 'Промокод убран' });
  };

  const pay = () => {
    if (cart.length === 0) {
      Toast.show({ type: 'info', text1: 'Корзина пуста' });
      return;
    }
    if (method === 'balance' && balance < finalTotal) {
      Toast.show({
        type: 'error',
        text1: 'Недостаточно средств',
        text2: `Нужно ещё ${finalTotal - balance} ₽`,
      });
      return;
    }
    if (method === 'balance') setBalance(balance - finalTotal);

    cart.forEach((item) => {
      addOrder({
        id: Date.now() + Math.random(),
        title: item.title,
        price: item.price,
        date: new Date().toLocaleString('ru-RU'),
        type: item.type,
        period: item.period || null,
      });
    });

    clearCart();
    Toast.show({
      type: 'success',
      text1: 'Успешно оплачено!',
      text2: `Списано ${finalTotal} ₽${discount ? ` (скидка ${discount} ₽)` : ''}`,
    });
    navigation.navigate('Success', { total: finalTotal });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headT}>Оплата</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sec}>Способ оплаты</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setMethod(m.id)}
            style={[styles.method, method === m.id && styles.methodA]}
            activeOpacity={0.8}
          >
            <Icon name={m.icon} size={22} color={method === m.id ? colors.primaryLight : colors.textMuted} />
            <Text style={styles.methodT}>{m.name}</Text>
            {method === m.id && <Icon name="checkmark-circle" size={20} color={colors.primaryLight} />}
          </TouchableOpacity>
        ))}

        <Text style={styles.sec}>Промокод</Text>
        {promo ? (
          <View style={styles.promoApplied}>
            <Icon name="pricetag" size={20} color={colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.promoCode}>{promo.code}</Text>
              <Text style={styles.promoDesc}>{promo.description}</Text>
            </View>
            <TouchableOpacity onPress={handleRemovePromo} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close-circle" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Введите код (например GGCELL10)"
              placeholderTextColor={colors.textMuted}
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleApplyPromo} style={styles.promoBtn} activeOpacity={0.85}>
              <Text style={styles.promoBtnT}>Применить</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sec}>Состав заказа</Text>
        <View style={styles.summary}>
          {cart.length === 0 ? (
            <Text style={styles.empty}>Корзина пуста</Text>
          ) : (
            cart.map((i) => (
              <View key={i.id} style={styles.sRow}>
                <Text style={styles.sText} numberOfLines={1}>{i.title}</Text>
                <Text style={styles.sPrice}>{i.price} ₽</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.totalBox}>
          <View>
            <Text style={styles.totalL}>К оплате</Text>
            {discount > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.summaryLine}>Сумма: {totalPrice} ₽</Text>
                <Text style={styles.discountLine}>Скидка: −{discount} ₽</Text>
              </View>
            )}
          </View>
          <Text style={styles.totalP}>{finalTotal} ₽</Text>
        </View>

        {method === 'balance' && (
          <View style={styles.balanceInfo}>
            <Text style={styles.balText}>
              Ваш баланс:{' '}
              <Text style={{ color: colors.accent, fontWeight: 'bold' }}>{balance} ₽</Text>
            </Text>
          </View>
        )}

        {method === 'balance' && balance < finalTotal && (
          <TouchableOpacity
            onPress={() => { setBalance(balance + 1000); Toast.show({ type: 'success', text1: 'Баланс пополнен на 1000 ₽' }); }}
            style={styles.topup}
            activeOpacity={0.85}
          >
            <Icon name="add-circle-outline" size={20} color={colors.accent} />
            <Text style={styles.topupT}>Пополнить на 1000 ₽</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={pay} activeOpacity={0.85}>
          <LinearGradient colors={GRADIENTS.gold} style={styles.payBtn}>
            <Text style={styles.payT}>Оплатить {finalTotal} ₽</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headT: { color: C.text, fontSize: 18, fontWeight: '600' },
  sec: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 10 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  methodA: { borderColor: C.primary },
  methodT: { flex: 1, color: C.text, fontSize: 14 },

  promoRow: { flexDirection: 'row', gap: 8 },
  promoInput: {
    flex: 1, backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14,
  },
  promoBtn: {
    backgroundColor: C.primary, paddingHorizontal: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  promoBtnT: { color: '#fff', fontWeight: '600', fontSize: 13 },

  promoApplied: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.card, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: C.success,
  },
  promoCode: { color: C.text, fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  promoDesc: { color: C.textMuted, fontSize: 12, marginTop: 2 },

  summary: { backgroundColor: C.card, borderRadius: 14, padding: 14 },
  empty: { color: C.textMuted },
  sRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sText: { color: C.textMuted, flex: 1, marginRight: 10 },
  sPrice: { color: C.text, fontWeight: '600' },

  totalBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 20, padding: 16, backgroundColor: C.cardLight, borderRadius: 14,
  },
  totalL: { color: C.text, fontSize: 16 },
  totalP: { color: C.accent, fontSize: 22, fontWeight: 'bold' },
  summaryLine: { color: C.textMuted, fontSize: 12, marginTop: 4 },
  discountLine: { color: C.success, fontSize: 12, marginTop: 2, fontWeight: '600' },
  discountRow: { marginTop: 2 },

  balanceInfo: { marginTop: 12, padding: 12, backgroundColor: C.card, borderRadius: 12 },
  balText: { color: C.textMuted, fontSize: 14 },
  topup: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: C.accent,
  },
  topupT: { color: C.accent, fontWeight: '600' },

  payBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  payT: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
