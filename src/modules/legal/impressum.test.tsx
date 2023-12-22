import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Impressum from './impressum';

jest.mock('../app_configuration/app_texts', () => ({
    impressum_text: 'Mocked Impressum Text'
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('Datenschutz Card Tests', () => {
    it('renders without crashing', () => {
        render(
        <Router>
            <Impressum />
        </Router>
        );
        expect(screen.getByText('Impressum / Legal Notice')).toBeInTheDocument();
    });

    it('renders with config texts', () => {
        render(
            <Router>
                <Impressum />
            </Router>
            );
        const normalText = screen.getByText('Mocked Impressum Text');
        expect(normalText).toBeInTheDocument();
        expect(normalText).not.toHaveStyle('font-weight: bold');
    });

});
