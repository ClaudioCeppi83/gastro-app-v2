export const calculateOrderTotal = (subtotal: number, iva: number, serviceCharge: number): number => {
    return subtotal + iva + serviceCharge;
  };
  