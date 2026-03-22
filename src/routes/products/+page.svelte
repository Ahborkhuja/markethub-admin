<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api';
    import type { Product } from '$lib/types';
  
    let products = $state<Product[]>([]);
    let search = $state('');
    let loading = $state(true);

    const filtered = $derived(
      products.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      ),
    );

    onMount(async () => {
      try {
        const res = await api.post<any>('/products', {
          query: `query { products(filter: {}) {
            items { id name price stock category isActive sellerId rating createdAt }
            total
          }}`
        });
        products = res?.data?.products?.items || [];
      } finally {
        loading = false;
      }
    });
  
    const toggleProduct = async (product: Product) => {
      // Would call update endpoint
      product.isActive = !product.isActive;
      products = [...products]; // trigger reactivity
    };
  </script>
  
  <div class="page">
    <div class="page-header">
      <h1>Products</h1>
      <input bind:value={search} placeholder="Search products..." class="search" />
    </div>
  
    <div class="card">
      {#if loading}
        <p class="empty">Loading products...</p>
      {:else if filtered.length === 0}
        <p class="empty">No products found</p>
      {:else}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Seller ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filtered as product}
              <tr>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td class:low={product.stock < 10}>{product.stock}</td>
                <td>⭐ {product.rating?.toFixed(1)}</td>
                <td>#{product.sellerId}</td>
                <td>
                  <span class="badge badge-{product.isActive ? 'active' : 'inactive'}">
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm"
                    class:btn-danger={product.isActive}
                    class:btn-success={!product.isActive}
                    on:click={() => toggleProduct(product)}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
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
  }
  .empty { text-align: center; padding: 3rem; color: #6b7280; }
  .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8rem; }
  td.low { color: #ef4444; font-weight: bold; }
  </style>