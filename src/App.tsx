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
  const [guess, setGuess] = createSignal<string>('')
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
    saveState();
  });

  // Get all movie names
  const movieNames = movies.map(movie => movie.Name + " (" + movie.Year + ")").sort()

  // Choose movie based on days since 1/15/2024
  const date = new Date()
  const start = new Date(2024, 0, 15)
  const day = Math.floor((date.getTime() - start.getTime()) / (1000 * 3600 * 24))
  const MOVIE = movies[day % movies.length]

  // Share result to social media or copy to clipboard
  function shareResult() {
    let result = ''
    for (let i = 0; i < guesses().length; i++) {
      result += guesses()[i].toLowerCase() === MOVIE.Name.toLowerCase() ? '🟩' : '🟥'
    }
    for (let i = 0; i < 6 - guesses().length; i++) {
      result += '⬛'
    }

    result = `📼 Kino ﹟ ${day % movies.length + 1}\n ${result}`

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
      navigator.clipboard.writeText(result + '\n\n' + shareData.url)
        .then(() => {
          console.log('Copied to clipboard')
          alert('Copied result to clipboard')
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

  createEffect(on(guess, () => {
    if (guess()) {
      // remove year from guess
      const guessWithoutYear = guess().split('(')[0].trim();
      setGuesses([...guesses(), guessWithoutYear]);
  
      if (guessWithoutYear.toLowerCase() === MOVIE.Name.toLowerCase()) {
        setSuccess(true);
        updateStats();
        setGameOver(true);
      } else if (guesses().length === 6) {
        setSuccess(false);
        updateStats();
        setGameOver(true);
      }
    }
  }));

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

  const Guesses = () => {
    return <>
      <p>Guesses: {guesses().length} / 6</p>
      <div class="flex flex-wrap gap-2 justify-center">
        <For each={guesses()}>
          {(guess) => {
            return (
              <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p class="font-emoji">{guess == MOVIE.Name ? '🟩 ' + guess  : '🟥 ' + guess}</p>
              </div>
            );
          }}
        </For>
      </div>
    </>
  }

  const Endscreen = (props:any) => {
    const { message = '', emoji='' } = props; // default value is false if not provided
    return (
      <div class="p-2 bg-primary-800 rounded text-center w-full shadow">
        <p class='my-1 text-3xl font-bold'>
          <span class="font-emoji">{emoji} </span>
          {message}
          <span class="font-emoji">{emoji} </span>
        </p>
        <div class="flex items-center aspect-video m-2 gap-2">
          <img src={MOVIE.Poster} alt={MOVIE.Name} class="h-full object-cover rounded" />
          <div class="flex flex-col gap-2 text-center w-full">
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
          </div>
        </div>
        <hr class="border-accent-400" />
        <div class="mt-2" >
          <Stats />
        </div>
      </div>
    );
  };

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

  return (
    <>
      <div class="w-screen h-screen overflow-hidden bg-primary-900 text-primary-100">
        <div class="p-2 w-full md:w-1/2 xl:w-1/3 mx-auto flex flex-col gap-4">
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

          <Show when={gameOver()} fallback={
            <>
              <For each={MOVIE.Actors}>
                {(hint, i) => {
                  return (
                    <Show
                      when={i() <= guesses().length}
                      fallback={
                        <div class="p-2 bg-primary-800 rounded text-center w-full shadow">
                          <p>...</p>
                        </div>
                      }
                    >
                      <div class="p-2 bg-primary-700 rounded text-center w-full shadow">
                        <p>{hint}</p>
                      </div>
                    </Show>
                  );
                }}
              </For>
        
              <hr class="border-accent-400" />
              <MovieSelect guess={guess} setGuess={setGuess} options={movieNames} />
            </>
          }>
            {
              success() == true ?
                <Endscreen message="You got it!" emoji='🎉' /> :
                <Endscreen message="Better luck next time" emoji='🎬' />
            }
          </Show>
          <Show when={guesses().length > 0}>
            <Guesses />
          </Show>

          <hr class="border-accent-400" />
          <div class="flex text-xs text-primary-300 m-2 gap-2 justify-center">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default App
