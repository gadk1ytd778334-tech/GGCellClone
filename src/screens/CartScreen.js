import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import { useCart } from '../utils/CartContext';
import { COLORS, GRADIENTS } from '../utils/theme';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, totalPrice } = useCart();

  const handleRemove = (item) => {
    removeFromCart(item.id);
    Toast.show({ type: 'info', text1: 'Удалено из корзины', text2: item.title });
  };

  return (
    <View style={styles.c}>
      <Header navigation={navigation} />
      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="cart-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyT}>Корзина пуста</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')} activeOpacity={0.85}>
            <LinearGradient colors={GRADIENTS.primary} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnT}>Перейти в каталог</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.img} />
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.price}>{item.price} ₽</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemove(item)} style={{ padding: 8 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="trash-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalL}>Итого:</Text>
              <Text style={styles.totalP}>{totalPrice} ₽</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Checkout')} activeOpacity={0.85}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.checkBtn}>
                <Text style={styles.checkT}>Перейти к оплате</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyT: { color: COLORS.textMuted, fontSize: 16 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnT: { color: '#fff', fontWeight: '600' },
  item: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 14, padding: 10, alignItems: 'center', gap: 12 },
  img: { width: 70, height: 70, borderRadius: 10 },
  title: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  price: { color: COLORS.primaryLight, fontSize: 16, fontWeight: 'bold' },
  footer: { padding: 16, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalL: { color: COLORS.textMuted, fontSize: 15 },
  totalP: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  checkBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  checkT: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
