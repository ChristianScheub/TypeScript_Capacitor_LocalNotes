import React from 'react';
import { render, fireEvent, screen,RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsView from './screen_settings'; 
import { BrowserRouter as Router } from 'react-router-dom';


describe('SettingsView Component', () => {
  const mockNavigate = jest.fn();
  const mockOnDeleteAllClick = jest.fn();
  const mockOnDeleteBiometryClick = jest.fn();
  const mockOnDatenschutzClick = jest.fn();
  const mockOnImpressumClick = jest.fn();
  const mockOnExportAllClick = jest.fn();
  const mockOnFileChange = jest.fn();
  const mockOnDeleteNotesClick = jest.fn();

  const defaultProps = {
    showFingerprintBtn: true,
    onDeleteAllClick: mockOnDeleteAllClick,
    onDeleteBiometryClick: mockOnDeleteBiometryClick,
    onDatenschutzClick: mockOnDatenschutzClick,
    onImpressumClick: mockOnImpressumClick,
    onExportAllClick: mockOnExportAllClick,
    onFileChange: mockOnFileChange,
    onDeleteNotesClick: mockOnDeleteNotesClick,
    isAlreadyLoggedIn: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement): RenderResult => {
    return render(<Router>{component}</Router>);
  };

  test('renders correctly with default props', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
  });

  test('calls onFileChange when a file is selected', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    renderWithRouter(<SettingsView {...defaultProps} />);

    const fileInput = screen.getByLabelText('Select file');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnFileChange).toHaveBeenCalledWith(expect.anything());
  });

  test('calls mockOnDeleteNotesClick when "Alle Notizen löschen" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('settings-delete-all-Notes'));
    expect(mockOnDeleteNotesClick).toHaveBeenCalled();
  });
  
  test('calls mockOnExportAllClick when "Alle Notizen exportieren" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('settings-export-notes'));
    expect(mockOnExportAllClick).toHaveBeenCalled();
  });
  
  test('calls mockOnImpressumClick when "Impressum" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('settings-impressum'));
    expect(mockOnImpressumClick).toHaveBeenCalled();
  });
  
  test('calls mockOnDatenschutzClick when "Datenschutz" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('settings-edatenschutz'));
    expect(mockOnDatenschutzClick).toHaveBeenCalled();
  });
  
  test('calls mockOnDeleteBiometryClick when "Biometrischer Login Passwort löschen" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('settings-delete-bio-login'));
    expect(mockOnDeleteBiometryClick).toHaveBeenCalled();
  });
  
  test('calls onDeleteAllClick when "Alle Daten löschen" is clicked', () => {
    renderWithRouter(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByTestId('delete-all-button'));
    expect(mockOnDeleteAllClick).toHaveBeenCalledWith(true, expect.any(Function));
  });
});
