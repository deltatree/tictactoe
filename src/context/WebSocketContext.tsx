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

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children,
  serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
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
      // Transport configuration for firewall compatibility
      transports: ['websocket', 'polling'], // Try WebSocket first, fall back to polling
      upgrade: true, // Allow upgrading from polling to WebSocket
      
      // Reconnection configuration with exponential backoff
      reconnection: true,
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 10000, // Max 10 seconds between attempts
      reconnectionAttempts: Infinity, // Never give up! (user can manually disconnect)
      
      // Connection timeouts
      timeout: 20000, // 20 seconds for initial connection
      
      // Force new connection (don't reuse old ones)
      forceNew: false,
      
      // Auto-connect
      autoConnect: false, // We control connection manually
    });

    newSocket.on('connect', () => {
      console.log('WebSocket: Connected!', newSocket.id);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Monitor transport for debugging
      const currentTransport = newSocket.io.engine?.transport?.name;
      console.log('WebSocket: Using transport:', currentTransport);
      setTransport(currentTransport || null);
      
      // Listen for transport upgrades
      newSocket.io.engine?.on('upgrade', () => {
        const upgradedTransport = newSocket.io.engine?.transport?.name;
        console.log('WebSocket: Upgraded to transport:', upgradedTransport);
        setTransport(upgradedTransport || null);
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket: Disconnected:', reason);
      setConnectionStatus('disconnected');
      setTransport(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket: Connection error:', error.message);
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
