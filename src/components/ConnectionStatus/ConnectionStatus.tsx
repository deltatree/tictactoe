import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import type { ConnectionStatus as ConnectionStatusType } from '../../context/WebSocketContext';
import './ConnectionStatus.css';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useWebSocket();

  const getStatusInfo = (status: ConnectionStatusType) => {
    switch (status) {
      case 'connected':
        return {
          icon: '🟢',
          text: 'Online',
          className: 'connected'
        };
      case 'connecting':
        return {
          icon: '🟡',
          text: 'Verbinde...',
          className: 'connecting'
        };
      case 'reconnecting':
        return {
          icon: '🟡',
          text: 'Verbinde neu...',
          className: 'reconnecting'
        };
      case 'disconnected':
        return {
          icon: '🔴',
          text: 'Offline',
          className: 'disconnected'
        };
      default:
        return {
          icon: '⚪',
          text: 'Unbekannt',
          className: 'unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(connectionStatus);

  return (
    <div className={`connection-status ${statusInfo.className}`}>
      <span className="connection-icon">{statusInfo.icon}</span>
      <span className="connection-text">{statusInfo.text}</span>
    </div>
  );
};

export default ConnectionStatus;
