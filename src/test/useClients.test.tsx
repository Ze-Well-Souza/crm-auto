import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClients } from '../hooks/useClients';
import { supabase } from '../integrations/supabase/client';

// Mock Supabase
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

// Mock toast
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock plan limits
vi.mock('../hooks/usePlanLimits', () => ({
  usePlanLimits: () => ({
    checkAndIncrement: vi.fn(() => Promise.resolve(true))
  })
}));

describe('useClients', () => {
  const mockClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      user_id: 'user123',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      user_id: 'user123',
      created_at: '2024-01-02',
      updated_at: '2024-01-02'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch clients successfully', async () => {
    const mockSession = { user: { id: 'user123' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession }
    } as any);

    const mockOrder = vi.fn().mockResolvedValue({
      data: mockClients,
      error: null
    });

    const mockSelect = vi.fn(() => ({ order: mockOrder }));
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const { result } = renderHook(() => useClients());

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Fetch clients
    await result.current.fetchClients();

    await waitFor(() => {
      expect(result.current.clients).toEqual(mockClients);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle authentication error', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null }
    } as any);

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.fetchClients();

    await waitFor(() => {
      expect(result.current.clients).toEqual([]);
      expect(result.current.error).toBe('Usuário não autenticado');
    });
  });

  it('should handle fetch error', async () => {
    const mockSession = { user: { id: 'user123' } };
    const mockError = { message: 'Database error' };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession }
    } as any);

    const mockOrder = vi.fn().mockResolvedValue({
      data: null,
      error: mockError
    });

    const mockSelect = vi.fn(() => ({ order: mockOrder }));
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.fetchClients();

    await waitFor(() => {
      expect(result.current.clients).toEqual([]);
      expect(result.current.error).toBe('Database error');
    });
  });

  it('should create client successfully', async () => {
    const mockSession = { user: { id: 'user123' } };
    const newClient = {
      name: 'New Client',
      email: 'new@example.com',
      phone: '5555555555'
    };
    const createdClient = {
      ...newClient,
      id: '3',
      user_id: 'user123',
      created_at: '2024-01-03',
      updated_at: '2024-01-03'
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession }
    } as any);

    const mockSingle = vi.fn().mockResolvedValue({
      data: createdClient,
      error: null
    });

    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockInsert = vi.fn(() => ({ select: mockSelect }));
    
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any);

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const created = await result.current.createClient(newClient);

    expect(created).toEqual(createdClient);
    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(mockInsert).toHaveBeenCalledWith([{
      ...newClient,
      user_id: 'user123'
    }]);
  });
});