// src/app/__tests__/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../page'; // Ajusta la ruta según tu estructura

// Mock de cualquier dependencia o contexto si es necesario
jest.mock('@/store/orderStore', () => ({
  useOrderStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearOrder: jest.fn(),
    getTotalItems: jest.fn(() => 0),
    getSubtotal: jest.fn(() => 0),
    getTaxes: jest.fn(() => 0),
    getTotal: jest.fn(() => 0),
  })),
}));

describe('Home Page', () => {
  it('renders the main heading', () => {
    // Renderiza el componente Page. Asegúrate de que no dependa de datos externos
    // o proporciona mocks si es necesario.
    render(<Page />); 

    // Busca un elemento de encabezado que contenga el texto esperado.
    // Ajusta el texto según el contenido real de tu página principal.
    const heading = screen.getByRole('heading', {
      name: /Bienvenido a GastroApp/i, // Ajusta este texto
    });

    expect(heading).toBeInTheDocument();
  });

  // Puedes añadir más pruebas aquí para verificar otros elementos de la página
  // Por ejemplo, verificar si se muestra un menú o una lista de productos.
  it('renders product list placeholder if available', () => {
    render(<Page />);
    // Ejemplo: Verifica si un componente específico (como ProductList) se renderiza
    // Esto asume que tienes un texto o rol identificable en ese componente.
    // const productList = screen.getByTestId('product-list'); // Si usas data-testid
    // expect(productList).toBeInTheDocument();

    // O busca un texto genérico si no tienes identificadores específicos
    // expect(screen.getByText(/Cargando productos.../i)).toBeInTheDocument(); // Ajusta el texto
  });
});