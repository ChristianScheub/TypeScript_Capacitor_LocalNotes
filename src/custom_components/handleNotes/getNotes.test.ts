import { renderHook} from "@testing-library/react";
import { render, act } from "@testing-library/react";

import getNotes from './getNotes';

describe('useNotes', () => {
  const encryptionKey = 'Hans';

  it('should load and decrypt notes correctly', () => {
    localStorage.clear();
    localStorage.setItem('123', 'U2FsdGVkX1/9Jg/jAIvOEuWSpmgTa9EIACMNKFwdT5k=');
    const { result } = renderHook(() => getNotes(encryptionKey, ''));

    expect(result.current).toEqual([{ id: '123', content: 'Neue Notiz lol' }]);
  });

  it('should handle decryption error gracefully', () => {
    localStorage.clear();
    localStorage.setItem('note1', 'U2FsdGVkX1/9Jg/jAIvOEudsmkmdk=');
    const { result } = renderHook(() => getNotes(encryptionKey, ''));

    expect(result.current).toEqual([{ id: 'note1', content: '' }]);
  });

  it('should handle without crash when nothing is here', () => {
    localStorage.clear();
    const { result } = renderHook(() => getNotes("", ''));
    expect(result.current).toEqual([]);
  });

  it('should not crash with invalid/empty key', () => {
    localStorage.clear();
    localStorage.setItem("", 'U2FsdGVkX1/9Jg/jAIvOEuWSpmgTa9EIACMNKFwdT5k=');
    const { result } = renderHook(() => getNotes(encryptionKey, ''));
    expect(result.current).toEqual([]);
  });

  it('should not crash with invalid/empty text', () => {
    localStorage.clear();
    localStorage.setItem("1", '');
    const { result } = renderHook(() => getNotes(encryptionKey, ''));
    expect(result.current).toEqual([]);
  });
  
});
