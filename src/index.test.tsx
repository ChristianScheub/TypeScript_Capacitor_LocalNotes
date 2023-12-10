import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom/client';


describe('App Component Tests', () => {
  test('renders App component', () => {
    render(<App />);
    expect(screen.getByText(/Bitte gib deinen Verschlüsselungscode ein! Deine Notizen werden anschließend mit einer AES Verschlüsselung verschlüsselt und sind folglich nicht mehr wieder herstellbar. Merke ihn dir also gut!/i)).toBeInTheDocument();
  });

  it('calls ReactDOM.createRoot', () => {
    const mockRender = jest.fn();
    const createRootMock = jest.fn(() => ({ render: mockRender }));
    ReactDOM.createRoot = createRootMock as any;

    document.getElementById = jest.fn().mockReturnValue(document.createElement('div'));
    require('./index');

    expect(createRootMock).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});