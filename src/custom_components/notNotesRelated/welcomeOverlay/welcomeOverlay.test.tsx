import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import WelcomeOverlay from './welcomeOverlay'; // Stellen Sie sicher, dass dieser Pfad korrekt ist

// Mock-Implementierung von useTranslation mit Typsicherheit
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        "welcomeOverlay.h1": "Welcome!",
        "welcomeOverlay.p1": "This is the first paragraph.",
        "furtherFeatures.h1": "Further Features",
        "furtherFeatures.li1": "Feature 1",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock für closeOverlay-Funktion
const mockCloseOverlay = jest.fn();

describe('WelcomeOverlay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the first screen correctly', () => {
    render(<WelcomeOverlay closeOverlay={mockCloseOverlay} />);
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('This is the first paragraph.')).toBeInTheDocument();
  });

  test('switches to second screen on button click', () => {
    render(<WelcomeOverlay closeOverlay={mockCloseOverlay} />);
    fireEvent.click(screen.getByTestId("welcome-overlay-firstDone"));
    expect(screen.getByText('Further Features')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
  });

  test('closes the overlay on close button click', () => {
    render(<WelcomeOverlay closeOverlay={mockCloseOverlay} />);
    fireEvent.click(screen.getByTestId("welcome-overlay-firstDone"));
    fireEvent.click(screen.getByTestId("welcome-overlay-secondDone"));
    expect(mockCloseOverlay).toHaveBeenCalled();
  });
});