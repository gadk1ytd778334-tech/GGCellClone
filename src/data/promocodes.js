// Промокоды для демонстрации
// type: 'percent' — скидка в процентах
// type: 'fixed'   — фиксированная скидка в рублях
export const PROMOCODES = [
  { code: 'GGCELL10', type: 'percent', value: 10, description: '−10% на весь заказ' },
  { code: 'WELCOME',  type: 'fixed',   value: 200, description: '−200 ₽ на первый заказ' },
  { code: 'GAMER',    type: 'percent', value: 15, description: '−15% для геймеров' },
  { code: 'FREESHIP', type: 'fixed',   value: 99,  description: '−99 ₽ на аренду' },
  { code: 'SUPER50',  type: 'fixed',   value: 500, description: '−500 ₽ от 2000 ₽' },
];

export const findPromocode = (input) => {
  if (!input) return null;
  return PROMOCODES.find(
    (p) => p.code.toLowerCase() === input.trim().toLowerCase()
  );
};

export const applyDiscount = (total, promo, cart = []) => {
  if (!promo) return 0;
  if (promo.code === 'SUPER50' && total < 2000) return 0; // условие
  if (promo.type === 'percent') {
    return Math.round((total * promo.value) / 100);
  }
  if (promo.type === 'fixed') {
    // FREESHIP действует только если в корзине есть аренда
    if (promo.code === 'FREESHIP' && !cart.some((i) => i.type === 'rental')) return 0;
    return Math.min(promo.value, total);
  }
  return 0;
};
