import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

interface WebSocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
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

  const connect = useCallback(() => {
    if (socket?.connected) {
      console.log('WebSocket: Already connected');
      return;
    }

    console.log(`WebSocket: Connecting to ${serverUrl}...`);
    setConnectionStatus('connecting');

    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('WebSocket: Connected!', newSocket.id);
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket: Disconnected:', reason);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket: Connection error:', error.message);
      setConnectionStatus('disconnected');
    });

    newSocket.io.on('reconnect_attempt', () => {
      console.log('WebSocket: Attempting to reconnect...');
      setConnectionStatus('reconnecting');
    });

    newSocket.io.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket: Reconnected after ${attemptNumber} attempts`);
      setConnectionStatus('connected');
    });

    newSocket.io.on('reconnect_failed', () => {
      console.error('WebSocket: Reconnection failed');
      setConnectionStatus('disconnected');
    });

    setSocket(newSocket);
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
