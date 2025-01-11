import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Silence console logs/errors during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Mock axios with consistent responses
jest.mock('./utils/axios', () => {
  const mockApi = {
    get: jest.fn((url) => {
      if (url.includes('/usuarios/') && url.includes('/detalle')) {
        return Promise.resolve({
          data: {
            id: 1,
            nombre: 'Test User',
            email: 'test@test.com',
            role: 'ADMIN',
            membresias: [{
              id: 1,
              tipo: 'MENSUAL',
              activa: true,
              fechaInicio: '2024-01-01',
              fechaFin: '2024-02-01'
            }],
            rutinas: [],
            clasesInscritas: [],
            seguimientos: []
          }
        });
      }
      return Promise.resolve({ data: {} });
    }),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  return {
    create: () => mockApi,
    ...mockApi
  };
});

describe('App Tests', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  test('renderiza la página de login cuando no hay usuario autenticado', async () => {
    localStorage.getItem.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  test('redirige a clientes cuando el usuario es ADMIN', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'ADMIN';
      if (key === 'token') return 'fake-token';
      if (key === 'userId') return '1';
      return null;
    });

    render(
      <MemoryRouter initialEntries={['/usuarios/clientes']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/gestión de gimnasio/i)).toBeInTheDocument();
    });
  });

  test('redirige a dashboard cuando el usuario es CLIENTE', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'CLIENTE';
      if (key === 'token') return 'fake-token';
      if (key === 'userId') return '1';
      return null;
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  test('protege rutas para roles no autorizados', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'CLIENTE';
      if (key === 'token') return 'fake-token';
      if (key === 'userId') return '1';
      return null;
    });

    render(
      <MemoryRouter initialEntries={['/usuarios/clientes']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/listado de clientes/i)).not.toBeInTheDocument();
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});