<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { isLoggedIn } from '$lib/stores/auth';
	import { fromStore } from 'svelte/store';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { browser } from '$app/environment';

	let { children }: { children: Snippet } = $props();

	const isLoginPage = $derived(page.url.pathname === '/login');
	const loggedIn = fromStore(isLoggedIn);

	$effect(() => {
		if (browser && !loggedIn.current && !isLoginPage) {
			window.location.href = '/login';
		}
	});
</script>

<Toast />

{#if isLoginPage}
	{@render children()}
{:else if $isLoggedIn}
	<div class="layout">
		<Sidebar />
		<main class="main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.layout {
		display: flex;
		min-height: 100vh;
	}
	.main {
		flex: 1;
		margin-left: 240px;
		padding: 2rem;
		overflow-y: auto;
	}
</style>
