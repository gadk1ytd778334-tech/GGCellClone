import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SuccessScreen from '../screens/SuccessScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import WheelScreen from '../screens/WheelScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: 'home', Catalog: 'game-controller', Cart: 'cart', Profile: 'person' };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Главная' }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ tabBarLabel: 'Каталог' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Корзина' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Профиль' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();
  const { mode, colors } = useTheme();

  const navTheme = mode === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.card } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Wheel" component={WheelScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
