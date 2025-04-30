import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

// Mock de datos de ejemplo
const mockOrderItems = [
  { id: '1', productName: 'Plato 1', price: 10, quantity: 2 },
  { id: '2', productName: 'Bebida 1', price: 3, quantity: 1 },
];

const mockRemoveItem = jest.fn();
const mockRemoveItemLoading = { '1': false, '2': false };
const mockRemoveItemError = { '1': null, '2': null };

describe('OrderSummary Component', () => {
  it('renderiza los elementos del pedido correctamente', () => {
    render(
      <OrderSummary
        orderItems={mockOrderItems}
        onRemoveItem={mockRemoveItem}
        removeItemLoading={mockRemoveItemLoading}
        removeItemError={mockRemoveItemError}
      />
    );
    expect(screen.getByText('Plato 1')).toBeInTheDocument();
    expect(screen.getByText('Bebida 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$3.00')).toBeInTheDocument();
  });

  it('muestra el mensaje de "No items yet." si no hay productos', () => {
    render(
      <OrderSummary
        orderItems={[]}
        onRemoveItem={mockRemoveItem}
        removeItemLoading={{}}
        removeItemError={{}}
      />
    );
    expect(screen.getByText(/No items yet\./i)).toBeInTheDocument();
  });

  it('muestra el título principal', () => {
    render(
      <OrderSummary
        orderItems={mockOrderItems}
        onRemoveItem={mockRemoveItem}
        removeItemLoading={mockRemoveItemLoading}
        removeItemError={mockRemoveItemError}
      />
    );
    expect(screen.getByRole('heading', { name: /Orden Actual/i })).toBeInTheDocument();
  });
});