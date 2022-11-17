<style>
  .wrapper {
    display: flex;
  }

  .section--left {
    flex: 1;
    background-image: url('./assets/thomas-serer-unsplash.jpg');
    height: 100vh;
    background-position: right;
    background-size: cover;
    transform: rotate(-4deg) scale(1.2);
    box-shadow: 0 0 2rem 1rem #00000050;
    margin: 0;
  }
  .section--right {
    flex: 3;
    display: grid;
    justify-content: center;
    align-items: center;
  }

  .voting {
    display: grid;
    flex-direction: column;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .voting__header {
    justify-self: center;
    grid-column-start: span 2;
  }
  .voting__card {
    display: grid;
    gap: .5rem;
    flex-wrap: wrap;
    border: 2px solid #333333;
    border-radius: .5rem;
    padding: 1rem;
    box-shadow: 0 0 .5rem .1rem #00000050;
  }

  .voting__card img {
    justify-self: center;
    width: 10rem;
    box-shadow: 0 0 .5rem .1rem #00000050;
    user-select: none;
  }

  .card__desc {
    text-align: center;
    font-weight: 500;
  }

  .voting__submit button {
    padding: 1rem  10rem;
    background-color: green;
  }
</style>

<main>
  <div class="wrapper">
    <div class="section--left">
    </div>
    <div class="section--right">
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
          <button>
            Oddaj głos
          </button>
        </div>
      </div>
    </div>
  </div>
</main>

<script>
  
</script>