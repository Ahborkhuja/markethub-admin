<script lang="ts">
	let {
		title,
		value,
		icon,
		change = '',
		color = '#4f46e5',
	}: {
		title: string;
		value: string | number;
		icon: string;
		change?: string;
		color?: string;
	} = $props();
</script>
  
  <div class="stats-card card">
    <div class="card-header">
      <span class="title">{title}</span>
      <div class="icon-wrap" style="background: {color}20">
        <span style="color: {color}">{icon}</span>
      </div>
    </div>
    <div class="value">{value}</div>
    {#if change}
      <div class="change">{change}</div>
    {/if}
  </div>
  
  <style>
  .stats-card { cursor: default; }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .title { font-size: 0.875rem; color: #6b7280; font-weight: 500; }
  .icon-wrap {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center;
    justify-content: center; font-size: 1.25rem;
  }
  .value { font-size: 2rem; font-weight: bold; color: #111; }
  .change { font-size: 0.8rem; color: #22c55e; margin-top: 0.25rem; }
  </style>