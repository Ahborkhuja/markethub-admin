<script lang="ts">
    import { api } from '$lib/api';
    import { authStore } from '$lib/stores/auth';
  
    let email = '';
    let password = '';
    let loading = false;
    let error = '';
  
    const handleSubmit = async () => {
      loading = true;
      error = '';
      try {
        const res = await api.post<any>('/auth/login', { email, password });
  
        // Only allow admin
        if (res.user.role !== 'admin') {
          error = 'Access denied — admins only';
          return;
        }
  
        authStore.login(res.user, res.accessToken, res.refreshToken);
        window.location.href = '/';
      } catch (e: any) {
        error = e.message || 'Login failed';
      } finally {
        loading = false;
      }
    };
  </script>
  
  <div class="login-page">
    <div class="login-card">
      <div class="logo">⚙️</div>
      <h1>Admin Panel</h1>
      <p>MarketHub Administration</p>
  
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" bind:value={email} type="email" placeholder="admin@markethub.com" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" bind:value={password} type="password" placeholder="••••••••" required />
        </div>
  
        {#if error}
          <p class="error">{error}</p>
        {/if}
  
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login to Admin'}
        </button>
      </form>
    </div>
  </div>
  
  <style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e1b4b;
  }
  .login-card {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  .logo { font-size: 3rem; margin-bottom: 1rem; }
  h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: #6b7280; margin-bottom: 2rem; }
  .form-group { margin-bottom: 1rem; text-align: left; }
  label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
  input {
    width: 100%; padding: 0.75rem;
    border: 1px solid #e5e7eb; border-radius: 8px;
    font-size: 1rem; box-sizing: border-box;
  }
  .btn-primary { width: 100%; padding: 0.875rem; margin-top: 0.5rem; border-radius: 8px; }
  .error { color: #ef4444; font-size: 0.875rem; margin-bottom: 0.5rem; }
  </style>