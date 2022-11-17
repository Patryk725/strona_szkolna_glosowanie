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

  .nav--login {
    position: fixed;
    top: 0;
    right: 20px;
    gap: .2rem;
  }

  .nav--login_list {
    display: flex;
    gap: 1.5rem;
    list-style-type: none;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 1rem;
  }

  .option--login_option:hover {
    text-decoration: underline;
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
    cursor: pointer;
    transition: .1s ease;
  }
  
  .voting__card:hover {
    transform: translateY(-2%);
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

  .voting__submit {
    grid-column-start: span 2;
  }

  .voting__submit button {
    width: 100%;
    padding: 1.2rem 0;
    border: none;
    font-size: 1.2rem;
    background-color: #349EDA;
    cursor: pointer;
    text-shadow: 0 0 .2rem #000000;
    color: #ffffff;
    border-radius: .5rem;
    transition: .1s ease;
    user-select: none;
  }

  .voting__submit button:hover {
    background-color: #35B6FF;
  }
</style>

<main>
  <div class="wrapper">
    <div class="section--left">
    </div>
    <div class="section--right">
      <nav class="nav--login">
        <ul class="nav--login_list">
          <li class="option--login_option">
            zaloguj się
          </li>
          <li class="option--login_option">
            profil
          </li>
        </ul>
      </nav>
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
    </div>
  </div>
</main>

<script>
  function handleVoting() {
    alert('musisz być zalogowany, aby oddać głos');
  }
  function handleModal() {
    this.showModal();
  }
</script>