import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookieConsentBanner from './cookieConsentBanner';

describe('CookieConsentBanner Component', () => {   

  it('should render the consent banner initially', () => {
    render(<CookieConsentBanner />);
    expect(screen.getByText('Lokale Daten Speicherung')).toBeInTheDocument();
  });

  it('should accept cookies and hide the banner when "Accept All" is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByTestId('accept-all-button'));
     expect(localStorage.getItem('progress-saving-enabled')).toBe('true');
    expect(localStorage.getItem('username-saving-enabled')).toBe('true');
    expect(screen.queryByText('Lokale Daten Speicherung')).toBeNull();
  });

  it('should decline cookies and hide the banner when "Decline All" is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByTestId('decline-all-button'));
    expect(localStorage.getItem('progress-saving-enabled')).toBeNull();
    expect(localStorage.getItem('username-saving-enabled')).toBeNull();
    expect(localStorage.getItem('completedLessons')).toBeNull();
    expect(screen.queryByText('Lokale Daten Speicherung')).toBeNull();
  });

  it('should show customize settings modal when "Customize Settings" is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByText('Customize Settings'));
    expect(screen.getByText('Cookie-Einstellungen anpassen')).toBeInTheDocument();
  });

  it('should save settings and hide the banner when "Save" is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByText('Customize Settings'));
    fireEvent.click(screen.getByText('Save'));
    expect(screen.queryByText('Cookie-Einstellungen anpassen')).toBeNull();
    expect(screen.queryByText('Lokale Daten Speicherung')).toBeNull();
  });
});
