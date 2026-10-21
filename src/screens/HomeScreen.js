import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { RENTAL_ACCOUNTS, GAMES } from '../data/products';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';
import { useBonus } from '../utils/BonusContext';
import Toast from 'react-native-toast-message';
import { COLORS, GRADIENTS } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { addToCart } = useCart();
  const { user, balance, setBalance } = useAuth();
  const { dailyClaimed, loading, claimDaily } = useBonus();
  const [prompted, setPrompted] = useState(false);

  // Показываем диалог ежедневного бонуса один раз при входе
  useEffect(() => {
    if (!loading && !dailyClaimed && !prompted) {
      setPrompted(true);
      setTimeout(() => {
        Alert.alert(
          '🎁 Ежедневный бонус',
          'Заберите 100 ₽ на баланс!\n\nДоступно раз в 24 часа.',
          [
            { text: 'Позже', style: 'cancel' },
            {
              text: 'Забрать 100 ₽',
              onPress: async () => {
                const ok = await claimDaily();
                if (ok) {
                  setBalance(balance + 100);
                  Toast.show({ type: 'success', text1: '+100 ₽', text2: 'Зачислено на баланс' });
                }
              },
            },
          ]
        );
      }, 800);
    }
  }, [loading, dailyClaimed, prompted]);

  const add = (item) => {
    addToCart(item);
    Toast.show({ type: 'success', text1: 'Добавлено в корзину', text2: item.title });
  };

  return (
    <View style={styles.c}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={styles.hi}>Привет, {user?.name || 'гость'} 👋</Text>
          <Text style={styles.subhi}>Что будем играть?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Catalog')} activeOpacity={0.9}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.banner}>
            <Text style={styles.bTitle}>🎁 Бонус новичкам</Text>
            <Text style={styles.bText}>1500 ₽ на баланс при регистрации</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnT}>Забрать</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHead}>
          <Text style={styles.sec}>🔥 Популярная аренда</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog', { category: 'rental' })} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={RENTAL_ACCOUNTS}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => add(item)}
            />
          )}
        />

        <View style={styles.sectionHead}>
          <Text style={styles.sec}>💎 Топ игры</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog', { category: 'game' })} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={GAMES}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => add(item)}
            />
          )}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Wheel')} activeOpacity={0.9} style={{ marginHorizontal: 16, marginTop: 24 }}>
          <LinearGradient colors={GRADIENTS.gold} style={styles.wheelBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.wheelTitle}>🎡 Колесо фортуны</Text>
              <Text style={styles.wheelText}>Крутите раз в день и выигрывайте до 500 ₽</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.features}>
          {[
            { icon: 'shield-checkmark', title: 'Гарантия', text: '24/7 поддержка', route: 'Profile' },
            { icon: 'flash', title: 'Мгновенно', text: 'Выдача за 1 мин', route: 'Catalog' },
            { icon: 'card', title: 'Оплата', text: 'Любой способ', route: 'Cart' },
          ].map((f, i) => (
            <TouchableOpacity key={i} style={styles.feature} onPress={() => navigation.navigate(f.route)} activeOpacity={0.7}>
              <Icon name={f.icon} size={24} color={COLORS.primaryLight} />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.bg },
  hi: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  subhi: { color: COLORS.textMuted, marginTop: 4 },
  banner: { marginHorizontal: 16, borderRadius: 18, padding: 20, marginBottom: 24 },
  bTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bText: { color: '#fff', marginTop: 6, fontSize: 13 },
  bannerBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 12 },
  bannerBtnT: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 12, marginBottom: 12 },
  sec: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  seeAll: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '600' },
  wheelBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, padding: 20 },
  wheelTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  wheelText: { color: '#fff', opacity: 0.9, fontSize: 12, marginTop: 4 },
  features: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16, marginTop: 24, backgroundColor: COLORS.card, borderRadius: 16, padding: 16 },
  feature: { alignItems: 'center', gap: 6, flex: 1 },
  featureTitle: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  featureText: { color: COLORS.textMuted, fontSize: 10, textAlign: 'center' },
});
