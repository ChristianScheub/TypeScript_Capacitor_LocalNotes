import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import EditNote from './editNote';
import { encryptAndStore } from "./encryptionEngine";

const mockEncryptionKey = "some-encryption-key";


// Mock-Module vor dem Import der Testkomponente
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ noteId: 'test-note-id' }),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  encryptAndStore('{"title":"FirstTitle","date":"2023-12-09T12:35:44.679Z","content":"Test1"}', mockEncryptionKey,"note1",);
  encryptAndStore( '{"title":"SecondTitle","date":"2023-12-09T14:35:44.679Z","content":"Test2"}', mockEncryptionKey,"note2",);

});

describe('EditNote Component', () => {
  it('renders with correct data from local storage', () => {
    // Setze Mock-Daten im lokalen Speicher
    localStorage.setItem('test-id', JSON.stringify({ title: 'Test Title', date: '2023-01-01', content: 'Test Content' }));

    const { getByText, getByDisplayValue } = render(
      <Router>
        <EditNote encryptionKey="test-key" />
      </Router>
    );

    // Überprüfen, ob die Komponente mit den richtigen Daten gerendert wird
    expect(getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(getByDisplayValue('Test Content')).toBeInTheDocument();
    expect(getByText('01.01.2023')).toBeInTheDocument();
  });

  // Weitere Tests für Interaktionen und Funktionen hinzufügen...
});
