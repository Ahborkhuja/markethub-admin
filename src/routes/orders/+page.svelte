<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import type { Order } from '$lib/types';

  let orders = $state<Order[]>([]);
  let statusFilter = $state('');
  let loading = $state(true);

  const filtered = $derived(
    statusFilter ? orders.filter(o => o.status === statusFilter) : orders,
  );

  onMount(async () => {
    try {
      const res = await api.get<Order[]>('/orders');
      orders = Array.isArray(res) ? res : [];
    } finally {
      loading = false;
    }
  });

  const updateStatus = async (orderId: number, status: string) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    orders = orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    );
  };

  const statusTransitions: Record<string, string[]> = {
    pending:    ['confirmed', 'cancelled'],
    confirmed:  ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped:    ['delivered'],
    delivered:  [],
    cancelled:  [],
  };
</script>

<div class="page">
  <div class="page-header">
    <h1>Orders</h1>
    <select bind:value={statusFilter} class="filter-select">
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  <div class="card">
    {#if loading}
      <p class="empty">Loading orders...</p>
    {:else if filtered.length === 0}
      <p class="empty">No orders found</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer ID</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as order}
            <tr>
              <td>#{order.id}</td>
              <td>#{order.buyerId}</td>
              <td>{order.items?.length || 0} items</td>
              <td>${order.totalAmount?.toFixed(2)}</td>
              <td>{order.paymentStatus}</td>
              <td>
                <span class="badge badge-{order.status}">
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                {#if statusTransitions[order.status]?.length > 0}
                  <select
                    on:change={(e) => updateStatus(order.id, e.currentTarget.value)}
                    class="status-select"
                  >
                    <option value="">Update</option>
                    {#each statusTransitions[order.status] as next}
                      <option value={next}>{next}</option>
                    {/each}
                  </select>
                {:else}
                  <span class="text-muted">—</span>
                {/if}
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
.filter-select, .status-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px; font-size: 0.875rem;
}
.empty { text-align: center; padding: 3rem; color: #6b7280; }
.text-muted { color: #9ca3af; }
</style>