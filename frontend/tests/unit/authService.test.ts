import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../../src/services/authService';

// Mock the API client
vi.mock('../../src/lib/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should clear tokens from localStorage upon successful logout', async () => {
    localStorage.setItem('synapse_token', 'test_token');
    localStorage.setItem('token', 'test_token');

    const result = await authService.logout();

    expect(result).toBe(true);
    expect(localStorage.getItem('synapse_token')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should fall back to a mock token when API login fails', async () => {
    const email = 'test@synapse.ai';
    const result = await authService.login(email);

    expect(result).toBeDefined();
    expect(result.email).toBe(email);
    expect(result.access_token).toContain('mock_jwt_');
    expect(localStorage.getItem('synapse_token')).toBeDefined();
  });
});
