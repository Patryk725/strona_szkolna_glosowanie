<script>
    import Card from "./Card.svelte";

    function handleVoting() {
    	alert('musisz być zalogowany, aby oddać głos');
  	}

	let teams = [];

	fetch("src/assets/teams.json")
	.then(res => {
		res.json()
		.then(json => {
			teams = json;
			console.log(teams);
		});
	});
</script>

<div class="voting">
    <div class="voting__header">
    <h2>Kto wygra mecz?</h2>
    </div>

	<div id="team_view">
		{#each teams as team}
			<Card country_name="{team.name}" flag_image="{team.img}"/>
		{/each}
	</div>

    <div class="voting__submit">
        <button on:click={handleVoting}>
            Oddaj głos
        </button>
    </div>
</div>

<style>
	#team_view {
		overflow-y: scroll;
		height: 70vh;
		display: grid;
		flex-direction: column;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		width: 100%;
	}
</style>