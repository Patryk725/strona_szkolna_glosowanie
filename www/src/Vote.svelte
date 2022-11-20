<script>
    import Card from "./Card.svelte";

    function handleVoting() {
    	alert('musisz być zalogowany, aby oddać głos');
  	}

	let teams = [];

	fetch("src/assets/teams.json", {method: 'GET', headers: {'Content-Type': 'application/json'}})
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
    <h2>Kto zajmie 1. miejsce?</h2>
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
		width: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		height: 70vh;
		display: grid;
		flex-direction: column;
		grid-template-columns: repeat(2, 1fr);
		gap: calc(2vw - .2rem);
		width: 100%;
		padding: 1rem;
  		grid-column-start: span 2;
		flex-wrap: wrap;
	}
</style>