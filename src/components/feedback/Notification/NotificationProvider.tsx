import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import Notification, { NotificationProps } from "./Notification";
import styles from "./Notification.module.css";

export type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface NotificationItem extends NotificationProps {
  id: string;
}

interface NotificationContextType {
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
  warning: (message: string, description?: string) => string;
}

export const NotificationContext = React.createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPosition;
  maxCount?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = "top-right",
  maxCount = 5,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
      return addNotification({ type: "success", message, description });
    },
    [addNotification]
  );

  const error = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: "error", message, description });
    },
    [addNotification]
  );

  const info = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: "info", message, description });
    },
    [addNotification]
  );

  const warning = React.useCallback(
    (message: string, description?: string) => {
      return addNotification({ type: "warning", message, description });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
      {mounted &&
        createPortal(
          <div className={`${styles.container} ${styles[position]}`}>
            <AnimatePresence>
              {notifications.slice(0, maxCount).map(notification => (
                <Notification
                  key={notification.id}
                  {...notification}
                  onClose={() => removeNotification(notification.id)}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
