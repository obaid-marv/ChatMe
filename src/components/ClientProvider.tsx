// src/components/ClientProvider.tsx
"use client"; // Mark this file as a client component
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Adjust the path as needed

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;
