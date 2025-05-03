import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import Notification, { NotificationType, NotificationProps } from './Notification';
import styles from './Notification.module.css';

export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NotificationContainerProps {
  position?: NotificationPosition;
  maxCount?: number;
  notifications?: NotificationItem[];
  onRemove?: (id: string) => void;
}

interface NotificationItem extends NotificationProps {
  id: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const addNotification = React.useCallback((props: NotificationProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...props, id }]);
    return id;
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: 'success', message, description });
    },
    [addNotification]
  );

  const error = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: 'error', message, description });
    },
    [addNotification]
  );

  const info = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: 'info', message, description });
    },
    [addNotification]
  );

  const warning = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: 'warning', message, description });
    },
    [addNotification]
  );

  return {
    notifications,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  position = 'top-right',
  maxCount = 5,
  notifications = [],
  onRemove,
}) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={`${styles.container} ${styles[position]}`}>
      <AnimatePresence>
        {notifications.slice(0, maxCount).map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => onRemove?.(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default NotificationContainer;
