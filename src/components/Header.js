import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../utils/AuthContext';
import { useCart } from '../utils/CartContext';
import { COLORS } from '../utils/theme';

export default function Header({ onBack, navigation }) {
  const { balance } = useAuth();
  const { cart } = useCart();
  return (
    <View style={styles.c}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation?.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.logo}>🎮 GGCELL</Text>
        </TouchableOpacity>
      )}
      <View style={styles.right}>
        <TouchableOpacity onPress={() => navigation?.navigate('Profile')} style={styles.bal} activeOpacity={0.7}>
          <Icon name="wallet" size={14} color={COLORS.accent} />
          <Text style={styles.balT}>{balance} ₽</Text>
        </TouchableOpacity>
        {navigation && (
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ position: 'relative' }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="cart" size={22} color={COLORS.text} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeT}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.bg },
  logo: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bal: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.card, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  balT: { color: COLORS.accent, fontWeight: '600', fontSize: 12 },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeT: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
