<script>
    import { getContext } from "svelte/internal";


	export let country_name;
	export let flag_image;
	let current_medal = null;

	let setMedal = getContext('setMedal');

	function handleClick() {
		if (current_medal == null) {
			current_medal = setMedal();
		}
	}

</script>

<div class="voting__card" on:click={handleClick} on:keydown={() => {}}>
	<div class="card__img">
		<img src="{flag_image}" alt="{country_name} - Flaga">
	</div>
	<div class="card__desc">
		<p>{country_name}</p>
	</div>
	<div class="trophies">
		<div class="trophy">
			{#if current_medal == 1}
				<img src="src/assets/b_trophy.png" class="trophy__img" alt="trophy">
			{/if}
			{#if current_medal == 2}
				<img src="src/assets/s_trophy.png" class="trophy__img" alt="trophy">
			{/if}
			{#if current_medal == 3}
				<img src="src/assets/g_trophy.png" class="trophy__img" alt="trophy">
			{/if}
		</div>
	</div>
</div>
<style>

	.voting__card {
		position: relative;
	}

	.trophy__img {
		position: absolute;
		width: 48px;
		height: 48px;
		filter: drop-shadow(0 0 1px #00000090);
		box-shadow: none;
	}

	.trophy__img:first-child {
		top: -10px;
		right: -25px;
	}
	.trophy__img:nth-child(2) {
		top: -10px;
		right: 0px;
	}
	.trophy__img:nth-child(3) {
		top: -10px;
		right: 25px;
	}
</style>