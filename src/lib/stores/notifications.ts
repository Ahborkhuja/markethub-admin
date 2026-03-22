import { writable } from 'svelte/store';

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

const createNotificationStore = () => {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,
    add: (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      update(items => [{ ...notification, id }, ...items]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        update(items => items.filter(n => n.id !== id));
      }, 5000);
    },
    dismiss: (id: string) => {
      update(items => items.filter(n => n.id !== id));
    },
  };
};

export const notifications = createNotificationStore();