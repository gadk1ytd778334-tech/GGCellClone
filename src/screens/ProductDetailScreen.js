import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useCart } from '../utils/CartContext';
import { COLORS, GRADIENTS } from '../utils/theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();

  const add = () => {
    addToCart(product);
    Toast.show({ type: 'success', text1: 'Добавлено в корзину', text2: product.title });
  };

  const buy = () => {
    addToCart(product);
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.c}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: product.image }} style={styles.img} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('Cart')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="cart" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.plat}>
            {product.platform || product.game} {product.period && `• ${product.period}`}
          </Text>
          <View style={styles.priceRow}>
            {product.oldPrice && <Text style={styles.old}>{product.oldPrice} ₽</Text>}
            <Text style={styles.price}>{product.price} ₽</Text>
          </View>
          {product.description && (
            <>
              <Text style={styles.h}>Описание</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </>
          )}
          {product.features && (
            <>
              <Text style={styles.h}>Особенности</Text>
              {product.features.map((f, i) => (
                <View key={i} style={styles.feat}>
                  <Icon name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={styles.featT}>{f}</Text>
                </View>
              ))}
            </>
          )}

          {/* Блок системных требований (только для игр) */}
          {product.specs && (
            <>
              <Text style={styles.h}>Системные требования</Text>
              <View style={styles.specsBox}>
                <View style={styles.specRow}>
                  <Icon name="desktop-outline" size={16} color={COLORS.textMuted} />
                  <Text style={styles.specKey}>ОС:</Text>
                  <Text style={styles.specVal}>{product.specs.os}</Text>
                </View>
                <View style={styles.specRow}>
                  <Icon name="hardware-chip-outline" size={16} color={COLORS.textMuted} />
                  <Text style={styles.specKey}>Процессор:</Text>
                  <Text style={styles.specVal}>{product.specs.cpu}</Text>
                </View>
                <View style={styles.specRow}>
                  <Icon name="server-outline" size={16} color={COLORS.textMuted} />
                  <Text style={styles.specKey}>Память:</Text>
                  <Text style={styles.specVal}>{product.specs.ram}</Text>
                </View>
                <View style={styles.specRow}>
                  <Icon name="tv-outline" size={16} color={COLORS.textMuted} />
                  <Text style={styles.specKey}>Видеокарта:</Text>
                  <Text style={styles.specVal}>{product.specs.gpu}</Text>
                </View>
                <View style={styles.specRow}>
                  <Icon name="save-outline" size={16} color={COLORS.textMuted} />
                  <Text style={styles.specKey}>Место:</Text>
                  <Text style={styles.specVal}>{product.specs.storage}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.addBtn} onPress={add} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="cart-outline" size={22} color={COLORS.primaryLight} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={buy} activeOpacity={0.85}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.buyBtn}>
            <Text style={styles.buyT}>Купить за {product.price} ₽</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.bg },
  img: { width: '100%', height: 260, backgroundColor: COLORS.card },
  back: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 12 },
  cartIcon: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 12 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  plat: { color: COLORS.textMuted, marginTop: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 20 },
  price: { color: COLORS.text, fontSize: 28, fontWeight: 'bold' },
  old: { color: COLORS.textMuted, fontSize: 16, textDecorationLine: 'line-through', marginBottom: 4 },
  h: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  desc: { color: COLORS.textMuted, lineHeight: 20 },
  feat: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  featT: { color: COLORS.text },
  
  // Стили для блока характеристик
  specsBox: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specKey: {
    color: COLORS.textMuted,
    fontSize: 13,
    width: 90,
  },
  specVal: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },

  bar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 10, padding: 16, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  addBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  buyBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buyT: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
