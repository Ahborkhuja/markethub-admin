<script lang="ts">
    import { notifications } from '../stores/notifications';
  
    const getIcon = (type: string) => ({
      ORDER_CREATED:   '🎉',
      ORDER_CONFIRMED: '✅',
      ORDER_SHIPPED:   '📦',
      ORDER_DELIVERED: '🎁',
      ORDER_CANCELLED: '❌',
    }[type] || '🔔');
  </script>
  
  <div class="toast-container">
    {#each $notifications as n (n.id)}
      <div class="toast" class:success={n.type.includes('DELIVERED') || n.type.includes('CONFIRMED')}
           class:danger={n.type.includes('CANCELLED')}>
        <span class="icon">{getIcon(n.type)}</span>
        <p>{n.message}</p>
        <button on:click={() => notifications.dismiss(n.id)}>×</button>
      </div>
    {/each}
  </div>
  
  <style>
  .toast-container {
    position: fixed;
    top: 1rem; right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .toast {
    display: flex; align-items: center;
    gap: 0.75rem; padding: 1rem 1.25rem;
    background: white; border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 300px;
    border-left: 4px solid #4f46e5;
    animation: slideIn 0.3s ease;
  }
  .toast.success { border-left-color: #22c55e; }
  .toast.danger  { border-left-color: #ef4444; }
  .icon { font-size: 1.25rem; }
  p { flex: 1; font-size: 0.9rem; }
  button {
    background: none; border: none;
    font-size: 1.25rem; cursor: pointer; color: #9ca3af;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  </style>