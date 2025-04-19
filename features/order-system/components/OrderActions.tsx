// features/order-system/components/OrderActions.tsx
import React from 'react';

interface OrderActionsProps {
  onSubmitOrder: () => void;
  loading: boolean;
}

const OrderActions: React.FC<OrderActionsProps> = ({ onSubmitOrder, loading }) => {
  return (
    <section aria-labelledby="order-actions-heading">
      <h2 id="order-actions-heading" className="text-lg font-semibold mb-2">
        Order Actions
      </h2>
      <button
        onClick={onSubmitOrder}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Order'}
      </button>
    </section>
  );
};

export default OrderActions;