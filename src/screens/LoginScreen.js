import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../utils/AuthContext';
import { COLORS, GRADIENTS } from '../utils/theme';
export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@ggcell.ru');
  const [password, setPassword] = useState('123456');
  return (
    <LinearGradient colors={GRADIENTS.dark} style={styles.c}>
      <View style={styles.inner}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>GGCELL</Text>
        <Text style={styles.sub}>Аренда аккаунтов и покупка игр</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={COLORS.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Пароль" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity onPress={() => login(email)} activeOpacity={0.8}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.btn}><Text style={styles.btnT}>Войти</Text></LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
  logo: { fontSize: 64, textAlign: 'center' },
  title: { color: COLORS.text, fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  sub: { color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  btn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  btnT: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
