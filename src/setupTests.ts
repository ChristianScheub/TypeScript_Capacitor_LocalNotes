// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import './i18n';

// Polyfill for TextEncoder/TextDecoder required by React Router v7
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder as any;
(global as any).TextDecoder = TextDecoder as any;

// Jest compatibility shim for tests that use `jest.*` helpers (maps to Vitest's `vi`).
// This keeps most existing tests working without rewriting them.
(global as any).jest = (global as any).jest || (global as any).vi
