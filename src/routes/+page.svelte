<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api';
    import StatsCard from '$lib/components/StatsCard.svelte';
    import type { Order } from '$lib/types';
  
    let stats = $state({
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    });
    let recentOrders = $state<Order[]>([]);
    let loading = $state(true);
  
    onMount(async () => {
      try {
        // Fetch stats in parallel
        const [orders, products] = await Promise.all([
          api.get<Order[]>('/orders'),
          api.get<any>('/products'),
        ]);
  
        const orderList = Array.isArray(orders) ? orders : [];
        const productList = products?.data?.products?.items || [];
  
        stats = {
          totalOrders: orderList.length,
          totalProducts: productList.length,
          totalRevenue: orderList.reduce((sum: number, o: Order) =>
            sum + Number(o.totalAmount), 0),
          totalUsers: 0, // would need users endpoint
        };
  
        recentOrders = orderList.slice(0, 5);
      } finally {
        loading = false;
      }
    });
  </script>
  
  <div class="dashboard">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Welcome back! Here's what's happening.</p>
    </div>
  
    {#if loading}
      <div class="loading">Loading stats...</div>
    {:else}
      <!-- Stats Grid -->
      <div class="stats-grid">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="🛒"
          color="#4f46e5"
          change="All time"
        />
        <StatsCard
          title="Total Revenue"
          value="${stats.totalRevenue.toFixed(2)}"
          icon="💰"
          color="#22c55e"
          change="All time"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="#f59e0b"
          change="Active listings"
        />
        <StatsCard
          title="Platform Status"
          value="Online"
          icon="✅"
          color="#22c55e"
          change="All services running"
        />
      </div>
  
      <!-- Recent Orders -->
      <div class="card recent-orders">
        <div class="section-header">
          <h2>Recent Orders</h2>
          <a href="/orders" class="btn btn-ghost">View all →</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#each recentOrders as order}
              <tr>
                <td>#{ order.id}</td>
                <td>${order.totalAmount?.toFixed(2)}</td>
                <td>
                  <span class="badge badge-{order.status}">
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  
  <style>
  .page-header { margin-bottom: 2rem; }
  .page-header h1 { font-size: 1.75rem; font-weight: bold; }
  .page-header p { color: #6b7280; margin-top: 0.25rem; }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .recent-orders { margin-top: 1.5rem; }
  .section-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 1.5rem;
  }
  .section-header h2 { font-size: 1.1rem; font-weight: 600; }
  .loading { text-align: center; padding: 4rem; color: #6b7280; }
  </style>