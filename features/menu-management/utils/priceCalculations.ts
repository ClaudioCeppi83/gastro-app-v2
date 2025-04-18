export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercentage: number,
): number => {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Invalid discount percentage. Must be between 0 and 100.');
  }
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
};
