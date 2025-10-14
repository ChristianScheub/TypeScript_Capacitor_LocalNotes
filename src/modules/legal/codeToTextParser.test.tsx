import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeToTextParser from './codeToTextParser';

describe('CodeToTextParser Component', () => {

    it('should handle string without HTML tags correctly', () => {
        const code = 'This is a test string without HTML tags.';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText(/This is a test string without HTML tags./i)).toBeInTheDocument();
    });

    it('should render plain text correctly', () => {
        const code = 'Hello world!';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText('Hello world!')).toBeInTheDocument();
    });

    it('should render bold text correctly', () => {
        const code = 'Hello, <strong>world</strong>!';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText(/Hello,/i)).toBeInTheDocument();
        expect(screen.getByText(/world/i)).toBeInTheDocument();
        expect(screen.getByText(/world/i)).toHaveStyle('font-weight: bold');
    });

    it('should handle string with multiple bold tags correctly', () => {
        const code = 'This is a <strong>test</strong> string with <strong>multiple</strong> bold tags.';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText(/This is a /i)).toBeInTheDocument();
        expect(screen.getByText(/test/i)).toHaveStyle('font-weight: bold');
        expect(screen.getByText(/ string with /i)).toBeInTheDocument();
        expect(screen.getByText(/multiple/i)).toHaveStyle('font-weight: bold');
        expect(screen.getByText(/ bold tags./i)).toBeInTheDocument();
    });

    it('should handle text before bold tag correctly', () => {
        const code = 'Text before bold <strong>bold text</strong>';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText(/Text before bold/i)).toBeInTheDocument();
        expect(screen.getByText(/bold text/i)).toHaveStyle('font-weight: bold');
    });

    it('should handle absence of text before bold tag correctly', () => {
        const code = '<strong>bold text</strong>';
        render(<CodeToTextParser code={code} />);
        const boldText = screen.getByText('bold text');
        expect(boldText).toBeInTheDocument();
        expect(boldText).toHaveStyle('font-weight: bold');
        expect(screen.queryByText(/Text before bold/i)).toBeNull();
    });

    it('should render multiple lines correctly', () => {
        const code = 'Hello, <strong>world</strong>!<br /> React!';
        render(<CodeToTextParser code={code} />);
        expect(screen.getByText(/Hello,/i)).toBeInTheDocument();
        expect(screen.getByText(/world/i)).toBeInTheDocument();
        expect(screen.getByText(/world/i)).toHaveStyle('font-weight: bold');
        expect(screen.getByText(/React\!/i)).toBeInTheDocument();
    });
});
