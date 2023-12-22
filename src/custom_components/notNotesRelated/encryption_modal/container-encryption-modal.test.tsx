import React from 'react';
import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import EncryptionKeyModalContainer from './container-encryption-modal';
import * as fingerprintLogic from '../fingerprintLogic';
import { BrowserRouter as Router } from "react-router-dom";



jest.mock('../fingerprintLogic', () => ({
  availableBiometric: jest.fn(),
  getPasswordFromFingerprint: jest.fn(),
  storePasswordFromFingerprint: jest.fn(),
}));

describe('EncryptionKeyModalContainer', () => {
  const mockOnSubmit = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    (fingerprintLogic.availableBiometric as jest.Mock).mockResolvedValue(true);
    const { findByText } = render(<Router><EncryptionKeyModalContainer onSubmit={mockOnSubmit} /></Router>);
    expect(await findByText('Passwort eingeben')).toBeInTheDocument();
  });

  it('submits the encryption key', async () => {
    const { getByPlaceholderText, getByText } = render(<Router><EncryptionKeyModalContainer onSubmit={mockOnSubmit} /></Router>);
    
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.click(getByText('Weiter'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith('test123');
  });

  global.alert = jest.fn();

});
