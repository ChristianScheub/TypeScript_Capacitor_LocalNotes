import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Impressum from './impressum';
import { useNavigate } from 'react-router-dom';


jest.mock('../app_configuration/app_texts', () => ({
    impressum_text: 'Mocked Impressum Text'
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('Impressum Card Tests', () => {
    it('renders without crashing', () => {
        render(
            <Router>
                <Impressum/>
            </Router>
        );
        expect(screen.getByText('Impressum')).toBeInTheDocument();
    });

    it('renders with config texts', () => {
        render(
            <Router>
                <Impressum/>
            </Router>
        );
        const normalText = screen.getByText('Mocked Impressum Text');
        expect(normalText).toBeInTheDocument();
        expect(normalText).not.toHaveStyle('font-weight: bold');
    });

    it('navigates back when back arrow is clicked', () => {
        const navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);
        
        render(
            <Router>
                <Impressum/>
            </Router>
        );
        
        fireEvent.click(screen.getByTestId('backButton'));
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});