<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "$lib/api";
  import type { Order } from "$lib/types";

  let orders = $state<Order[]>([]);
  let loading = $state(true);

  const totalRevenue = $derived(
    orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
  );
  const avgOrderValue = $derived(
    orders.length ? totalRevenue / orders.length : 0,
  );

  const statusBreakdown = $derived(
    orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  const revenueByDay = $derived(
    orders.reduce(
      (acc, o) => {
        const day = new Date(o.createdAt).toLocaleDateString();
        acc[day] = (acc[day] || 0) + Number(o.totalAmount);
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  onMount(async () => {
    try {
      const res = await api.get<Order[]>("/orders");
      orders = Array.isArray(res) ? res : [];
    } finally {
      loading = false;
    }
  });
</script>

<div class="page">
  <h1>Analytics</h1>

  {#if loading}
    <p class="empty">Loading analytics...</p>
  {:else}
    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="card kpi">
        <h3>Total Revenue</h3>
        <p class="kpi-value">${totalRevenue.toFixed(2)}</p>
      </div>
      <div class="card kpi">
        <h3>Total Orders</h3>
        <p class="kpi-value">{orders.length}</p>
      </div>
      <div class="card kpi">
        <h3>Avg Order Value</h3>
        <p class="kpi-value">${avgOrderValue.toFixed(2)}</p>
      </div>
      <div class="card kpi">
        <h3>Completion Rate</h3>
        <p class="kpi-value">
          {orders.length
            ? Math.round(
                ((statusBreakdown["delivered"] || 0) / orders.length) * 100,
              )
            : 0}%
        </p>
      </div>
    </div>

    <!-- Status Breakdown -->
    <div class="analytics-grid">
      <div class="card">
        <h2>Orders by Status</h2>
        <div class="status-bars">
          {#each Object.entries(statusBreakdown) as [status, count]}
            <div class="bar-row">
              <span class="bar-label">
                <span class="badge badge-{status}">{status}</span>
              </span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  style="width: {((count / orders.length) * 100).toFixed(0)}%"
                ></div>
              </div>
              <span class="bar-value">{count}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Revenue by Day -->
      <div class="card">
        <h2>Revenue by Day</h2>
        <div class="revenue-list">
          {#each Object.entries(revenueByDay).slice(-7) as [day, revenue]}
            <div class="revenue-row">
              <span>{day}</span>
              <div class="revenue-bar-track">
                <div
                  class="revenue-bar"
                  style="width: {(
                    (revenue / Math.max(...Object.values(revenueByDay))) *
                    100
                  ).toFixed(0)}%"
                ></div>
              </div>
              <span>${revenue.toFixed(0)}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  h1 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .kpi h3 {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  .kpi-value {
    font-size: 2rem;
    font-weight: bold;
    color: #4f46e5;
  }
  .analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  .bar-row,
  .revenue-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  .bar-label {
    min-width: 100px;
  }
  .bar-track,
  .revenue-bar-track {
    flex: 1;
    height: 8px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    background: #4f46e5;
    border-radius: 4px;
  }
  .revenue-bar {
    height: 100%;
    background: #22c55e;
    border-radius: 4px;
  }
  .bar-value {
    min-width: 30px;
    text-align: right;
    font-size: 0.9rem;
  }
  .revenue-row span {
    min-width: 80px;
    font-size: 0.85rem;
    color: #6b7280;
  }
  .empty {
    text-align: center;
    padding: 4rem;
    color: #6b7280;
  }
</style>
