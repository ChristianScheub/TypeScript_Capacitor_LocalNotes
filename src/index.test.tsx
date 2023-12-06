import { render, screen } from '@testing-library/react';
import App from './App';


describe('App Component Tests', () => {
  test('renders App component', () => {
    render(<App />);
    expect(screen.getByText(/Bitte gib deinen Verschlüsselungscode ein. Falls noch keiner definiert wurde kannst du einen beliebigen nehmen. Deine Notizen werden anschließend mit einer AES Verschlüsselung verschlüsselt und sind folglich nicht mehr wieder herstellbar. Merke ihn dir also gut!/i)).toBeInTheDocument();
  });
});