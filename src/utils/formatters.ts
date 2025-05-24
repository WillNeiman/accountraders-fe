export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num);
}; 