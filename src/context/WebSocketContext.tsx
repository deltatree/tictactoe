import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

interface WebSocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  reconnectAttempts: number;
  transport: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

// Determine server URL outside component to avoid re-renders
const getDefaultServerUrl = (): string => {
  // Environment variable takes precedence
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  
  // In development (Vite dev server), use explicit backend port
  if (typeof window !== 'undefined' && 
      window.location.hostname === 'localhost' && 
      window.location.port === '5173') {
    return 'http://localhost:3001';  // Backend development port
  }
  
  // In production (Docker with nginx proxy), use same origin
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children,
  serverUrl = getDefaultServerUrl()
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [transport, setTransport] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socket?.connected) {
      console.log('WebSocket: Already connected');
      return;
    }

    console.log(`WebSocket: Connecting to ${serverUrl}...`);
    setConnectionStatus('connecting');

    const newSocket = io(serverUrl, {
      // Transport configuration for MAXIMUM firewall compatibility
      // IMPORTANT: Start with polling, then upgrade to WebSocket if possible
      // This ensures connection works even behind strict firewalls
      transports: ['polling', 'websocket'], // Polling first, then WebSocket upgrade
      upgrade: true, // Allow upgrading from polling to WebSocket
      rememberUpgrade: true, // Remember successful upgrades
      
      // Reconnection configuration with exponential backoff
      reconnection: true,
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 10000, // Max 10 seconds between attempts
      reconnectionAttempts: Infinity, // Never give up! (user can manually disconnect)
      
      // Connection timeouts - be patient for firewalls
      timeout: 30000, // 30 seconds for initial connection (increased for slow networks)
      
      // Force new connection (don't reuse old ones)
      forceNew: false,
      
      // Auto-connect
      autoConnect: false, // We control connection manually
      
      // Additional firewall compatibility settings
      closeOnBeforeunload: false, // Don't close on page unload (better reconnection)
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket: Connected!', newSocket.id);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Monitor transport for debugging
      const currentTransport = newSocket.io.engine?.transport?.name;
      console.log(`🔌 WebSocket: Using transport: ${currentTransport}`);
      setTransport(currentTransport || null);
      
      if (currentTransport === 'polling') {
        console.log('📡 WebSocket: Connected via HTTP polling (firewall-safe mode)');
        console.log('🔄 WebSocket: Will attempt to upgrade to WebSocket if possible...');
      } else if (currentTransport === 'websocket') {
        console.log('⚡ WebSocket: Connected via native WebSocket (optimal)');
      }
      
      // Listen for transport upgrades
      newSocket.io.engine?.on('upgrade', () => {
        const upgradedTransport = newSocket.io.engine?.transport?.name;
        console.log(`⬆️ WebSocket: Upgraded to transport: ${upgradedTransport}`);
        setTransport(upgradedTransport || null);
        
        if (upgradedTransport === 'websocket') {
          console.log('⚡ WebSocket: Successfully upgraded from polling to WebSocket!');
        }
      });
      
      // Listen for upgrade errors
      newSocket.io.engine?.on('upgradeError', (error: Error) => {
        console.warn('⚠️ WebSocket: Upgrade failed, staying on polling:', error.message);
        console.log('📡 WebSocket: Continuing with HTTP polling (stable connection)');
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected:', reason);
      setConnectionStatus('disconnected');
      setTransport(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket: Connection error:', error.message);
      console.log('🔄 WebSocket: Retrying with next transport (polling fallback)...');
      setConnectionStatus('disconnected');
    });

    newSocket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log(`WebSocket: Reconnect attempt ${attemptNumber}...`);
      setConnectionStatus('reconnecting');
      setReconnectAttempts(attemptNumber);
    });

    newSocket.io.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket: Reconnected after ${attemptNumber} attempts`);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
    });

    newSocket.io.on('reconnect_failed', () => {
      console.error('WebSocket: Reconnection failed after all attempts');
      setConnectionStatus('disconnected');
    });

    newSocket.io.on('error', (error) => {
      console.error('WebSocket: Manager error:', error);
    });

    setSocket(newSocket);
    
    // Manually connect (since autoConnect is false)
    newSocket.connect();
  }, [serverUrl, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('WebSocket: Disconnecting...');
      socket.disconnect();
      setSocket(null);
      setConnectionStatus('disconnected');
    }
  }, [socket]);

  const emit = useCallback((event: string, ...args: any[]) => {
    if (socket?.connected) {
      socket.emit(event, ...args);
    } else {
      console.warn(`WebSocket: Cannot emit "${event}" - not connected`);
    }
  }, [socket]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback);
  }, [socket]);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (callback) {
      socket?.off(event, callback);
    } else {
      socket?.off(event);
    }
  }, [socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value: WebSocketContextType = {
    socket,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    reconnectAttempts,
    transport,
    connect,
    disconnect,
    emit,
    on,
    off
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
