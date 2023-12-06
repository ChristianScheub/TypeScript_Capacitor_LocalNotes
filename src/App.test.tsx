import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe('App Component', () => {


  test('renders without crashing', () => {
    const renderResult = () => renderWithRouter(<App />);
    expect(renderResult).not.toThrow();
  });


test('renders encryption key modal on start', () => {
  const { getByTestId } = renderWithRouter(<App />);
  expect(getByTestId('password-input')).toBeInTheDocument();
});

test('closes modal on submit', async () => {
  const { getByText, queryByText } = renderWithRouter(<App />);
  const submitButton = getByText('Los!');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(queryByText(/Encryption Key/i)).not.toBeInTheDocument();
  });
});

});
