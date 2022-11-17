<div class="voting">
    <div class="voting__header">
    <h2>Kto wygra mecz?</h2>
    </div>
    <div class="voting__card">
    <div class="card__img">
        <img src="./src/assets/poland.png" alt="Poland">
    </div>
    <div class="card__desc">
        <p>Polska</p>
    </div>
    </div>
    <div class="voting__card">
    <div class="card__img">
        <img src="./src/assets/mexico.png" alt="Mexico">
    </div>
    <div class="card__desc">
        <p>Meksyk</p>
    </div>
    </div>
    <div class="voting__submit">
        <button on:click={handleVoting}>
            Oddaj głos
        </button>
    </div>
</div>

<script>
    function handleVoting() {
    alert('musisz być zalogowany, aby oddać głos');
  }
</script>