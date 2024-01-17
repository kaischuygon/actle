import { Show, For, createEffect, on, onCleanup } from "solid-js"
import { createSignal } from "solid-js";

import Modal from "./components/modal"
import MovieSelect from "./components/movieSelect"
import AboutIcon from "~icons/bx/bxs-info-circle"
import InfoIcon from "~icons/bx/bxs-book-open"
import GitHubIcon from "~icons/bx/bxl-github"
import ChartIcon from "~icons/bx/bx-bar-chart"

import movies from '../get_movies/movies.json'

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  winPercentage: string;
  streak: number;
  maxStreak: number;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return { hours, minutes, seconds };
}

function formatCamelCase(str: string) {
  return str
    // Insert a space before all capital letters
    .replace(/([A-Z])/g, ' $1')
    // Uppercase the first character
    .replace(/^./, str => str.toUpperCase());
}

function App() {
  // Get all movie names
  const movieNames = movies.map(movie => movie.Name + " (" + movie.Year + ")").sort()

  // Choose movie based on days since 1/15/2024
  const date = new Date()
  const start = new Date(2024, 0, 15)
  const day = Math.floor((date.getTime() - start.getTime()) / (1000 * 3600 * 24))
  const MOVIE = movies[day % movies.length]

  const [guess, setGuess] = createSignal<string>('')
  const [poster, setPoster] = createSignal<string>(MOVIE.Actors[0]['image'])
  const [guesses, setGuesses] = createSignal<string[]>([])
  const [success, setSuccess] = createSignal<boolean>(false)
  const [gameStats, setGameStats] = createSignal<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: '0%',
    streak: 0,
    maxStreak: 0,
  });
  const [timeUntilMidnight, setTimeUntilMidnight] = createSignal(getTimeUntilMidnight());
  const [gameOver, setGameOver] = createSignal(false);

  createEffect(() => {
    const intervalId = setInterval(() => {
      setTimeUntilMidnight(getTimeUntilMidnight());
    }, 1000);

    // Cleanup the interval when the component unmounts
    onCleanup(() => {
      clearInterval(intervalId);
    });
  });

  // Load stats from localStorage when the component mounts
  createEffect(() => {
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  });

  // Save stats to localStorage whenever they change
  createEffect(() => {
    const stats = gameStats();
    localStorage.setItem('gameStats', JSON.stringify(stats));
  });

  // Save state to localStorage
  const saveState = () => {
    const state = {
      guesses: guesses(),
      success: success(),
      poster: gameOver() ? MOVIE.Poster : MOVIE.Actors[guesses().length]['image'], // keep poster in sync with hints
      lastUpdated: new Date().getDate(),
      gameOver: gameOver()
    };
    localStorage.setItem('gameState', JSON.stringify(state));
  };

  // Load state from localStorage
  const loadState = () => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.lastUpdated !== new Date().getDate()) {
        // Reset state if it was saved yesterday
        localStorage.removeItem('gameState');
        return;
      }
      setGuesses(state.guesses);
      setSuccess(state.success);
      setPoster(state.poster);
      setGameOver(state.gameOver)
    }
  };

  // Call loadState when the app starts
  loadState();

  // Call saveState whenever the state changes
  createEffect(saveState);

  // Call saveState whenever a variable changes
  createEffect(() => {
    guesses();
    success();
    poster();
    saveState();
  });

  // Share result to social media or copy to clipboard
  function shareResult() {
    let result = ''
    let button = document.getElementById('shareButton')
    for (let i = 0; i < guesses().length; i++) {
      result += guesses()[i].toLowerCase() === MOVIE.Name.toLowerCase() ? '🟩' : '🟥'
    }
    for (let i = 0; i < 6 - guesses().length; i++) {
      result += '⬛'
    }

    result = `📼 Kino ﹟ ${day % movies.length + 1}\n ${result} \n https://www.kino.wtf`

    const shareData = {
      title: '📼 Kino ﹟' + (day % movies.length + 1),
      text: result,
      url: 'https://www.kino.wtf',
    }

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported in your browser')
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(result)
        .then(() => {
          console.log('Copied to clipboard')
          button!.innerHTML = 'Copied!'
        })
        .catch((error) => console.log('Error copying to clipboard', error));
    }
  };

  // Update stats when the game ends
  function updateStats() {
    const stats = gameStats();
    const newGamesPlayed = stats.gamesPlayed + 1;
    const newGamesWon = success() ? stats.gamesWon + 1 : stats.gamesWon;
    const newWinPercentage = String(Math.round(newGamesWon / newGamesPlayed * 100)) + '%';
    const newStreak = success() ? stats.streak + 1 : 0;
    const newMaxStreak = newStreak > stats.maxStreak ? newStreak : stats.maxStreak;
    setGameStats({
      gamesPlayed: newGamesPlayed,
      gamesWon: newGamesWon,
      winPercentage: newWinPercentage,
      streak: newStreak,
      maxStreak: newMaxStreak
    });
  }


  // Listen for guesses
  createEffect(on(guess, () => {
    if (guess()) {
      // remove year from guess
      setGuesses([...guesses(), guess()]);
  
      if (guess().toLowerCase() === MOVIE.Name.toLowerCase()) {
        setPoster(MOVIE.Poster)
        setSuccess(true);
        updateStats();
        setGameOver(true);
      } else if (guesses().length === 6) {
        setPoster(MOVIE.Poster)
        setSuccess(false);
        updateStats();
        setGameOver(true);
      } else {
        setPoster(MOVIE.Actors[guesses().length]['image'])
      }
    }
  }));

  /**
   * 
   * @returns About content for modal
   */
  const About = () => {
    return <>
      <p>
        A game for film buffs and casual moviegoers alike. Inspired by wordle, but for movies.
      </p>
      <p>
        Each day a new movie is chosen from a curated list, and the hints are based on the top 6 actors provided by the <a target="_blank" href="https://developer.themoviedb.org/reference/intro/getting-started">TMDB API</a>.
      </p>
      <p>
        Built with <a target="_blank" href="https://solidjs.com/">SolidJS</a> and <a target="_blank" href="https://tailwindcss.com/">Tailwind CSS</a>.
      </p>
    </>
  }

  /**
   * 
   * @returns Instuction content for modal
   */
  const Instructions = () => {
    return <>
      <ul>
        <li>
          Use the hints provided to guess a film.
        </li>
        <li>
          If you guess incorrectly, another actor from the film will be revealed.
        </li>
        <li>
          Leave the input blank to skip a guess and get the next hint.
        </li>
        <li>
          You have 6 attempts to guess the film.
        </li>
      </ul>
    </>
  }

  /**
   * @returns Bottom page guesses component with red or green emoji
   */
  const Guesses = () => {
    return <>
      <div class="p-2 font-bold">Guesses: {guesses().length} / 6</div>
      <div class="flex flex-wrap gap-2 justify-center">
        <For each={guesses()}>
          {(guess) => {
            return (
              <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p><span class="font-emoji">{guess == MOVIE.Name ? '🟩'  : '🟥'}</span> {guess}</p>
              </div>
            );
          }}
        </For>
      </div>
    </>
  }

  /**
   * 
   * @returns Title component with emoji
   */
  const Title = () => {
    return (
      <Show when={gameOver() == true} fallback={
        <div>
          <span class="font-emoji">🎞️ </span>
          Make a guess
          <span class="font-emoji"> 🎞️</span>
        </div>
      }>
        <Show when={success() == true} fallback={
          <div>
            <span class="font-emoji">🎬 </span>
            Better luck next time
            <span class="font-emoji"> 🎬</span>
          </div>
        }>
          <div>
            <span class="font-emoji">🎉 </span>
            You got it!
            <span class="font-emoji"> 🎉</span>
          </div>
        </Show>
      </Show>
    )
  }

  /**
   * 
   * @returns Endscreen summary with title, share button and emojis
   */
  const Endscreen = () => {
    return (<div class="flex flex-col gap-2 text-center w-full">
      <div>The answer was:</div>
      <div>
        <a href={`https://themoviedb.org/movie/${MOVIE["TMDb ID"]}`} class="text-lg font-bold">
          {MOVIE.Name} <span class="font-normal">({MOVIE.Year})</span>
        </a>
      </div>
      <div class="w-full font-emoji">
        <For each={guesses()}>
          {(guess) => {
            return (
              guess == MOVIE.Name ? '🟩' : '🟥'
            );
          }}
        </For>
        <For each={[...Array(6 - guesses().length)]}>
          {() => {
            return (
              '⬛'
            );
          }}
        </For>
      </div>
      <button class="w-min mx-auto p-2 bg-accent-400 rounded text-center shadow text-primary-950 hover:brightness-75 transition" id='shareButton' onclick={shareResult}>Share</button>
      <p>Next Game in: 
        <code>
          {String(timeUntilMidnight().hours).padStart(2, '0')}:
          {String(timeUntilMidnight().minutes).padStart(2, '0')}:
          {String(timeUntilMidnight().seconds).padStart(2, '0')}
        </code>
      </p>
    </div>)
  }

  /**
   * 
   * @param i index of hint
   * @returns function to change poster to hint
   */
  const changePoster = (i: number) => {
    return () => {
      setPoster(MOVIE.Actors[i]['image'])
    }
  }

  /**
   * 
   * @returns In progress component with hints
   */
  const InProgress = () => {
    return (
      <div class="flex flex-col justify-between w-full h-full gap-2">
        <For each={MOVIE.Actors}>
          {(hint, i) => {
            return (
              <Show
                when={i() <= guesses().length}
                fallback={
                  <button class="p-2 bg-primary-800 rounded text-center w-full shadow h-full" disabled>
                    ...
                  </button>
                }
              >
                <Show when={hint['image'] == poster()} fallback={
                    <button class="p-2 bg-primary-700 rounded text-center w-full shadow h-full hover:brightness-75" onclick={changePoster(i())}>
                      {hint['name']}
                    </button>
                }>
                  <button class="p-2 bg-accent-400 text-primary-900 rounded text-center w-full shadow h-full hover:brightness-75" onclick={changePoster(i())}>
                    {hint['name']}
                  </button>
                </Show>
              </Show>
            );
          }}
        </For>
      </div>)
  }

  /**
   * 
   * @returns Stats component with game stats, displayed in modal and gameScreen
   */
  const Stats = () => {
    return <>
      <div class="flex gap-2 justify-center flex-wrap" >
        <For each={Object.entries(gameStats())}>
          {([key, value]) => {
            return (
              <div class="p-2 bg-primary-700 rounded text-center shadow flex flex-col justify-center items-center">
                <span class="text-xl font-bold block">{value}</span>
                <span class="text-xs block">{formatCamelCase(key)}</span>
              </div>
            );
          }}
        </For>
      </div>
    </>
  }

  /**
   * 
   * @returns Game screen component with Title, poster, hints/endscreen and stats
   */
  const GameScreen = () => {
    return (
      <div class="text-center w-full">
        <p class='my-1 text-3xl font-bold'>
          <Title />
        </p>
        <div class="flex flex-col md:flex-row items-center md:aspect-[16/9] my-2 gap-2">
          <img src={poster()} alt={guesses().length != 6 ? MOVIE.Actors[guesses().length]['name'] : MOVIE.Name} class="object-cover rounded mx-auto max-h-[300px] md:max-h-none md:aspect-[2/3] md:h-full" />
          <Show when={gameOver() == true} fallback={
            <InProgress />
            }>
              <Endscreen />
          </Show>
        </div>
        <hr class="border-accent-400" />
        <div class="mt-2" >
          <Show when={gameOver() == true} fallback={
            <MovieSelect guess={guess} setGuess={setGuess} options={movieNames} />
          }>
            <Stats />
          </Show>
        </div>
        <Show when={guesses().length > 0}>
          <div class='mt-2'>
            <Guesses />
          </div>
        </Show>
      </div>
    );
  };

  /**
   * 
   * @returns Footer component with links
   */
  const Footer = () => {
    return (
      <div class="flex flex-wrap text-xs text-primary-300 m-2 gap-2 justify-center">
        <p>© 2023 <a target="_blank" href="https://kaischuyler.com">Kai Schuyler</a></p>
        <span>·</span>
        <span>
          <span>☕️ </span>
          <a href="https://www.buymeacoffee.com/kaischuyler" target="_blank">
            Buy me a coffee
          </a>
        </span>
        <span>·</span>
        <span class="inline">
          <GitHubIcon class="text-primary-100 inline mr-1" />
          <a target="_blank" href="https://github.com/kaischuygon/kino.wtf">
            source
          </a>
        </span>
        <span>·</span>
        <span class="inline">
          <a target="_blank" href="https://github.com/kaischuygon/kino.wtf/issues">
            issues?
          </a>
        </span>
      </div>
    )
  }

  /**
   * 
   * @returns Give up button
   */
  const GiveUp = () => {
    return (
      <button class="mx-auto p-2 bg-accent-400 rounded text-center shadow text-primary-950 hover:brightness-75 transition" onclick={() => {
        setPoster(MOVIE.Poster)
        setSuccess(false);
        updateStats();
        setGameOver(true);
      }}>Give up</button>
    )
  }

  return (
    <>
      <div class="w-screen h-screen bg-primary-900 text-primary-100">
        <div class="p-2 max-w-screen-sm 2xl:1/3 mx-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold text-center text-accent-400 font-display">
              <span class="font-emoji">📼</span> KINO
            </h1>
            <div class="flex gap-2 justify-center items-center ml-auto">
              <Modal Icon={AboutIcon} title="About" >
                <About />
              </Modal>
              <Modal Icon={InfoIcon} title="How to play">
                <Instructions />
              </Modal>
              <Modal Icon={ChartIcon} title="Stats">
                <Stats />
              </Modal>
            </div>
          </div>

          <hr class="border-accent-400"/>

          <GameScreen />
          <Show when={gameOver() == false}>
            <GiveUp />
          </Show>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
