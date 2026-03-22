<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '../stores/auth';

  const navItems = [
    { path: '/',           icon: '📊', label: 'Dashboard'  },
    { path: '/users',      icon: '👥', label: 'Users'      },
    { path: '/products',   icon: '📦', label: 'Products'   },
    { path: '/orders',     icon: '🛒', label: 'Orders'     },
    { path: '/analytics',  icon: '📈', label: 'Analytics'  },
  ];
</script>

<aside class="sidebar">
  <div class="brand">
    <span>⚙️ Admin</span>
    <small>MarketHub</small>
  </div>

  <nav>
    {#each navItems as item}
      <a
        href={item.path}
        class="nav-item"
        class:active={$page.url.pathname === item.path}
      >
        <span class="icon">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <div class="admin-info">
      <span>👤 {$authStore.user?.name || 'Admin'}</span>
      <small>{$authStore.user?.email || ''}</small>
    </div>
    <button class="btn btn-ghost logout" on:click={() => authStore.logout()}>
      Logout
    </button>
  </div>
</aside>

<style>
.sidebar {
  width: 240px;
  height: 100vh;
  background: #1e1b4b;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0; top: 0;
}
.brand {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
}
.brand span { font-size: 1.25rem; font-weight: bold; }
.brand small { opacity: 0.6; font-size: 0.8rem; }
nav { flex: 1; padding: 1rem 0; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255,255,255,0.7);
  transition: all 0.2s;
  border-left: 3px solid transparent;
}
.nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
.nav-item.active {
  background: rgba(255,255,255,0.15);
  color: white;
  border-left-color: #818cf8;
}
.icon { font-size: 1.1rem; }
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.admin-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}
.admin-info small { opacity: 0.6; font-size: 0.75rem; }
.logout { width: 100%; color: white; border-color: rgba(255,255,255,0.3); }
</style>