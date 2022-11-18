<script>
	export let country_name;
	export let flag_image;
</script>

<div class="voting__card">
	<div class="card__img">
		<img src="{flag_image}" alt="{country_name} - Flaga">
	</div>
	<div class="card__desc">
		<p>{country_name}</p>
	</div>
</div>