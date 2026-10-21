import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { RENTAL_ACCOUNTS, GAMES, CATEGORIES } from '../data/products';
import { useCart } from '../utils/CartContext';
import Toast from 'react-native-toast-message';
import { COLORS } from '../utils/theme';

export default function CatalogScreen({ navigation, route }) {
  const { addToCart } = useCart();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (route?.params?.category) {
      setCat(route.params.category);
    }
  }, [route?.params?.category]);

  const allItems = [...(RENTAL_ACCOUNTS || []), ...(GAMES || [])];
  const categories = CATEGORIES || [];

  const filteredItems = allItems.filter((item) => {
    if (!item) return false;
    const matchCat = cat === 'all' || item.type === cat;
    const matchSearch = item.title.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchSearch;
  });

  const add = (item) => {
    addToCart(item);
    Toast.show({ type: 'success', text1: 'Добавлено в корзину', text2: item.title });
  };

  return (
    <View style={styles.c}>
      <Header navigation={navigation} />

      <View style={styles.search}>
        <Icon name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Поиск игр и аккаунтов..."
          placeholderTextColor={COLORS.textMuted}
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {q.length > 0 && (
          <TouchableOpacity onPress={() => setQ('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cats}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setCat(c.id)}
            style={[styles.cat, cat === c.id && styles.catA]}
            activeOpacity={0.8}
          >
            <Text style={[styles.catT, cat === c.id && styles.catTA]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {q.length > 0 && (
        <Text style={styles.hint}>
          Найдено: {filteredItems.length} {filteredItems.length === 1 ? 'товар' : 'товаров'}
        </Text>
      )}

      <FlatList
        data={filteredItems}
        extraData={q} // <--- Это заставляет список обновляться при каждом вводе символа
        keyExtractor={(i) => i.id}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.empty}>Ничего не найдено</Text>
            <Text style={styles.emptyHint}>Попробуйте изменить запрос</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard
              item={item}
              compact
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => add(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.bg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: { flex: 1, color: COLORS.text, paddingVertical: 12, fontSize: 14 },
  cats: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginVertical: 8 },
  cat: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.card },
  catA: { backgroundColor: COLORS.primary },
  catT: { color: COLORS.textMuted, fontSize: 13 },
  catTA: { color: '#fff' },
  hint: { color: COLORS.textMuted, paddingHorizontal: 16, fontSize: 12, marginBottom: 8 },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  empty: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  emptyHint: { color: COLORS.textMuted, fontSize: 13 },
});
