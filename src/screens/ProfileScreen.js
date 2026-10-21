import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, balance, setBalance, orders } = useAuth();
  const { colors, gradients, mode, toggleTheme } = useTheme();

  const styles = makeStyles(colors);

  const handleOrders = () => {
    if (orders.length === 0) return Alert.alert('Мои заказы', 'У вас пока нет заказов.');
    const text = orders.map(o => `• ${o.title} — ${o.price} ₽\n  ${o.date}${o.period ? ` (${o.period})` : ''}`).join('\n\n');
    Alert.alert('Мои заказы', text);
  };

  const handleRentals = () => {
    const rentals = orders.filter(o => o.type === 'rental');
    if (rentals.length === 0) return Alert.alert('Активные аренды', 'У вас нет активных аренд.');
    const text = rentals.map(o => `• ${o.title}\n  До: ${o.period} (куплено ${o.date})`).join('\n\n');
    Alert.alert('Активные аренды', text);
  };

  const handleTopup = () => {
    Alert.alert('Пополнить баланс', 'Выберите сумму:', [
      { text: 'Отмена', style: 'cancel' },
      { text: '+500 ₽', onPress: () => { setBalance(balance + 500); Toast.show({ type: 'success', text1: '+500 ₽' }); } },
      { text: '+1000 ₽', onPress: () => { setBalance(balance + 1000); Toast.show({ type: 'success', text1: '+1000 ₽' }); } },
      { text: '+2000 ₽', onPress: () => { setBalance(balance + 2000); Toast.show({ type: 'success', text1: '+2000 ₽' }); } },
    ]);
  };

  const handleSupport = () => {
    Alert.alert('Поддержка 24/7', '📧 support@ggcell.ru\n💬 Telegram: @ggcell_support', [{ text: 'OK' }]);
  };

  const handleSettings = () => {
    Alert.alert(
      'Настройки',
      'Выберите действие:',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: mode === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема',
          onPress: toggleTheme,
        },
        { text: 'О приложении', onPress: () => Alert.alert('GGCELL', 'Клон приложения аренды аккаунтов\nВерсия 1.0.0') },
      ]
    );
  };

  const MENU = [
    { id: 'orders', name: 'Мои заказы', icon: 'receipt', action: handleOrders },
    { id: 'rentals', name: 'Активные аренды', icon: 'time', action: handleRentals },
    { id: 'favorites', name: 'Избранное', icon: 'heart', action: () => navigation.navigate('Favorites') },
    { id: 'topup', name: 'Пополнить баланс', icon: 'card', action: handleTopup },
    { id: 'support', name: 'Поддержка 24/7', icon: 'chatbubbles', action: handleSupport },
    { id: 'settings', name: 'Настройки', icon: 'settings', action: handleSettings },
  ];

  return (
    <ScrollView style={styles.c} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <LinearGradient colors={gradients.primary} style={styles.avatar}>
          <Text style={styles.avatarT}>{(user?.name || 'G')[0].toUpperCase()}</Text>
        </LinearGradient>
        <Text style={styles.name}>{user?.name || 'Гость'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={handleTopup}>
        <LinearGradient colors={gradients.gold} style={styles.balCard}>
          <Text style={styles.balL}>Баланс — нажмите для пополнения</Text>
          <Text style={styles.balV}>{balance} ₽</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.themeSwitch, { borderColor: colors.border }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Icon name={mode === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.primaryLight} />
        <Text style={styles.themeSwitchT}>
          {mode === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
        </Text>
        <Icon name="swap-horizontal" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.menu}>
        {MENU.map((m) => (
          <TouchableOpacity key={m.id} style={styles.mi} onPress={m.action} activeOpacity={0.7}>
            <View style={styles.miIcon}><Icon name={m.icon} size={20} color={colors.primaryLight} /></View>
            <Text style={styles.miT}>{m.name}</Text>
            <Icon name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout} activeOpacity={0.7}>
        <Icon name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutT}>Выйти</Text>
      </TouchableOpacity>
      <Text style={styles.ver}>GGCELL Clone v1.0.0</Text>
    </ScrollView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  c: { flex: 1, backgroundColor: C.bg },
  header: { alignItems: 'center', paddingTop: 30, paddingBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { color: C.text, fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  email: { color: C.textMuted, fontSize: 13, marginTop: 4 },
  balCard: { marginHorizontal: 16, borderRadius: 18, padding: 20 },
  balL: { color: '#fff', opacity: 0.9, fontSize: 13 },
  balV: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  themeSwitch: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 16, padding: 14, borderRadius: 14,
    backgroundColor: C.card, borderWidth: 1,
  },
  themeSwitchT: { flex: 1, color: C.text, fontSize: 14, fontWeight: '500' },
  menu: { marginTop: 16, marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  mi: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  miIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.cardLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  miT: { flex: 1, color: C.text, fontSize: 14 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, padding: 16 },
  logoutT: { color: C.danger, fontSize: 14, fontWeight: '600' },
  ver: { color: C.textMuted, textAlign: 'center', fontSize: 11, marginBottom: 30 },
});
