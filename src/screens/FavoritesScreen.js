import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../utils/FavoritesContext';
import { useCart } from '../utils/CartContext';
import { useTheme } from '../utils/ThemeContext';
import Toast from 'react-native-toast-message';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const add = (item) => {
    addToCart(item);
    Toast.show({ type: 'success', text1: 'Добавлено в корзину' });
  };

  return (
    <View style={styles.c}>
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headT}>Избранное ({favorites.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="heart-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyT}>Здесь пока пусто</Text>
          <Text style={styles.emptyH}>Добавляйте игры в избранное тапом по ❤️</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 12, padding: 16 }}
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
      )}
    </View>
  );
}

const makeStyles = (C) => StyleSheet.create({
  c: { flex: 1, backgroundColor: C.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headT: { color: C.text, fontSize: 18, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  emptyT: { color: C.text, fontSize: 18, fontWeight: '600' },
  emptyH: { color: C.textMuted, fontSize: 13, textAlign: 'center' },
});
