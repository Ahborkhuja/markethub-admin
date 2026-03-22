<script lang="ts">
    import { onMount } from 'svelte';
    import type { User } from '$lib/types';
  
    let users = $state<User[]>([]);
    let search = $state('');
    let loading = $state(true);

    const filtered = $derived(
      users.filter(
        u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    );

    onMount(async () => {
      try {
        // Note: would need a users list endpoint in User Service
        // For now showing mock data structure
        users = [];
      } finally {
        loading = false;
      }
    });
  </script>
  
  <div class="page">
    <div class="page-header">
      <h1>Users</h1>
      <input
        bind:value={search}
        placeholder="Search users..."
        class="search"
      />
    </div>
  
    <div class="card">
      {#if loading}
        <p class="empty">Loading users...</p>
      {:else if filtered.length === 0}
        <p class="empty">No users found</p>
      {:else}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filtered as user}
              <tr>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span class="badge badge-{user.role}">
                    {user.role}
                  </span>
                </td>
                <td>
                  <span class="badge badge-{user.isActive ? 'active' : 'inactive'}">
                    {user.isActive ? 'Active' : 'Banned'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-danger btn-sm">
                    {user.isActive ? 'Ban' : 'Unban'}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
  
  <style>
  .page-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 1.5rem;
  }
  h1 { font-size: 1.75rem; font-weight: bold; }
  .search {
    padding: 0.625rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px; width: 280px;
    font-size: 0.9rem;
  }
  .empty { text-align: center; padding: 3rem; color: #6b7280; }
  .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8rem; }
  </style>