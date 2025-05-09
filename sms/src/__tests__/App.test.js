// src/__tests__/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Suppress the deprecation warning for now
const originalError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalError;
});

test('renders the student management system header link', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headerLink = screen.getByRole('link', { name: /student management system/i });
  expect(headerLink).toBeInTheDocument();
});