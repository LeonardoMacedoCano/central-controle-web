export function formatValueToBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

export const formatNumberWithLeadingZeros = (number: number, digits: number): string => {
  return number.toString().padStart(digits, '0');
};

export const formatNumberWithTrailingZeros = (number: number, decimals: number): string => {
  return number.toFixed(decimals).replace('.', ',');
};

