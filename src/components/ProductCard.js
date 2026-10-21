import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../utils/FavoritesContext';
import { COLORS } from '../utils/theme';

export default function ProductCard({ item, onPress, onAdd, compact }) {
  const [imgError, setImgError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const isRental = item.type === 'rental';
  const fav = isFavorite(item.id);

  const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, compact && styles.compact]}>
      <View style={styles.imgWrap}>
        {!imgError ? (
          <Image
            source={imageSource}
            style={styles.img}
            onError={() => setImgError(true)}
            resizeMode={isRental ? 'contain' : 'cover'}
          />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Icon name="image-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.placeholderText}>Нет фото</Text>
          </View>
        )}
        {/* Кнопка избранного */}
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? COLORS.danger : '#fff'} />
        </TouchableOpacity>
      </View>
      {isRental && (
        <View style={styles.rent}><Text style={styles.badgeT}>АРЕНДА</Text></View>
      )}
      {item.oldPrice && (
        <View style={styles.disc}>
          <Text style={styles.badgeT}>-{Math.round((1 - item.price / item.oldPrice) * 100)}%</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.row}>
          <Icon name="star" size={12} color={COLORS.accent} />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.plat}>{item.platform || item.game}</Text>
        </View>
        <View style={styles.row}>
          <View>
            {item.oldPrice && <Text style={styles.old}>{item.oldPrice} ₽</Text>}
            <Text style={styles.price}>{item.price} ₽</Text>
          </View>
          {onAdd && (
            <TouchableOpacity onPress={onAdd} style={styles.add} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', width: 200, marginRight: 12 },
  compact: { width: '100%', marginRight: 0 },
  imgWrap: { width: '100%', height: 110, backgroundColor: COLORS.cardLight },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 4 },
  placeholderText: { color: COLORS.textMuted, fontSize: 10 },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  rent: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  disc: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.danger, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeT: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  body: { padding: 10 },
  title: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8, justifyContent: 'space-between' },
  rating: { color: COLORS.textMuted, fontSize: 11 },
  plat: { color: COLORS.textMuted, fontSize: 10 },
  price: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  old: { color: COLORS.textMuted, fontSize: 11, textDecorationLine: 'line-through' },
  add: { backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
