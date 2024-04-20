import { Show, For, createEffect, on, onCleanup } from "solid-js"
import { createSignal } from "solid-js";

import Modal from "../components/modal"
import CustomSelect from "../components/customSelect"
import AboutIcon from "~icons/bx/bxs-info-circle"
import InfoIcon from "~icons/bx/bxs-book-open"
import GitHubIcon from "~icons/bx/bxl-github"
import ChartIcon from "~icons/bx/bx-bar-chart"

import actors from '../../get_movies/actors.json'

interface actorStats {
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

export default () => {
  // Get all actor names
  const actorNames = actors.map(actor => actor.Name).sort()

  // Choose actor based on days since 2/28/2024
  const date = new Date()
  const start = new Date(2024, 1, 29)
  const day = Math.floor((date.getTime() - start.getTime()) / (1000 * 3600 * 24))
  const ACTOR = actors[day % actors.length]

  const [actorGuess, setActorGuess] = createSignal<string>('')
  const [actorPoster, setActorPoster] = createSignal<string>(ACTOR.Credits[0]['image'] || '')
  const [actorGuesses, setActorGuesses] = createSignal<string[]>([])
  const [actorSuccess, setActorSuccess] = createSignal<boolean>(false)
  const [actorStats, setActorStats] = createSignal<actorStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: '0%',
    streak: 0,
    maxStreak: 0,
  });
  const [timeUntilMidnight, setTimeUntilMidnight] = createSignal(getTimeUntilMidnight());
  const [actorGameOver, setActorGameOver] = createSignal(false);

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
    const savedStats = localStorage.getItem('actorStats');
    if (savedStats) {
      setActorStats(JSON.parse(savedStats));
    }
  });

  // Save stats to localStorage whenever they change
  createEffect(() => {
    const stats = actorStats();
    localStorage.setItem('actorStats', JSON.stringify(stats));
  });

  // Save state to localStorage
  const saveState = () => {
    const state = {
      guesses: actorGuesses(),
      success: actorSuccess(),
      poster: actorGameOver() ? ACTOR.Headshot : ACTOR.Credits[actorGuesses().length]['image'], // keep poster in sync with guesses
      lastUpdated: new Date().getDate(),
      actorGameOver: actorGameOver()
    };
    localStorage.setItem('actorGameState', JSON.stringify(state));
  };

  // Load state from localStorage
  const loadState = () => {
    const savedState = localStorage.getItem('actorGameState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.lastUpdated !== new Date().getDate()) {
        // Reset state if it was saved yesterday
        localStorage.removeItem('actorGameState');
        return;
      }
      setActorGuesses(state.guesses);
      setActorSuccess(state.success);
      setActorPoster(state.poster);
      setActorGameOver(state.actorGameOver)
    }
  };

  // Call loadState when the app starts
  loadState();

  // Call saveState whenever the state changes
  createEffect(saveState);

  // Call saveState whenever a variable changes
  createEffect(() => {
    actorGuesses();
    actorSuccess();
    actorPoster();
    saveState();
  });

  // Copy result to clipboard
  function shareResult() {
    let score = ''
    let button = document.getElementById('shareButton')
    for (let i = 0; i < actorGuesses().length; i++) {
      console.log(actorGuesses()[i])
      score += actorGuesses()[i].toLowerCase() === ACTOR.Name.toLowerCase() ? '🟩' : (actorGuesses()[i].trim() === '' ? '🟨': '🟥')
    }
    for (let i = 0; i < 6 - actorGuesses().length; i++) {
      score += '⬛'
    }

    let result = `🎭 Kino actors ﹟${day % actors.length + 1}\n${score}\n📼 https://www.kino.wtf`

    // Check if the Share API is supported
    // if (navigator.share) {
    //   navigator.share({
    //     text: result,
    //   })
    //     .then(() => console.log('Successful share'))
    //     .catch((error) => console.log('Error sharing', error));
    //   return;
    // } else {
      // console.log('Share API not supported')
      // Copy to clipboard
      navigator.clipboard.writeText(result)
        .then(() => {
          console.log('Copied to clipboard')
          button!.innerHTML = 'Copied!'
          // Reset button text after 2 seconds
          setTimeout(() => {
            button!.innerHTML = 'Share'
          }, 2000)
        })
        .catch((error) => console.log('Error copying to clipboard', error));
    // };
  }

  // Update stats when the game ends
  function updateStats() {
    const stats = actorStats();
    const newGamesPlayed = stats.gamesPlayed + 1;
    const newGamesWon = actorSuccess() ? stats.gamesWon + 1 : stats.gamesWon;
    const newWinPercentage = String(Math.round(newGamesWon / newGamesPlayed * 100)) + '%';
    const newStreak = actorSuccess() ? stats.streak + 1 : 0;
    const newMaxStreak = newStreak > stats.maxStreak ? newStreak : stats.maxStreak;
    setActorStats({
      gamesPlayed: newGamesPlayed,
      gamesWon: newGamesWon,
      winPercentage: newWinPercentage,
      streak: newStreak,
      maxStreak: newMaxStreak
    });
  }

  // Listen for guesses
  createEffect(on(actorGuess, () => {
    if (actorGuess()) {
      setActorGuesses([...actorGuesses(), actorGuess()]);
  
      if (actorGuess().toLowerCase() === ACTOR.Name.toLowerCase()) {
        setActorPoster(ACTOR.Headshot)
        setActorSuccess(true);
        updateStats();
        setActorGameOver(true);
      } else if (actorGuesses().length === 6) {
        setActorPoster(ACTOR.Headshot)
        setActorSuccess(false);
        updateStats();
        setActorGameOver(true);
      } else {
        setActorPoster(ACTOR.Credits[actorGuesses().length]['image'] || '')
      }
    }
  }));

  // Guesses component with emojis
  const Guesses = () => {
    return <>
      <div class="p-2 font-bold">Guesses: {actorGuesses().length} / 6</div>
      <div class="flex flex-wrap gap-2 justify-center">
        <For each={actorGuesses()}>
          {(guess) => {
            return (
              <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p><span class="font-emoji">{guess == ACTOR.Name ? '🟩'  : (guess.trim() == '' ? '🟨' : '🟥')}</span> {(guess.trim() == '' ? 'Skipped' : guess)}</p>
              </div>
            );
          }}
        </For>
      </div>
    </>
  }

  // Title component with emojis
  const Title = () => {
    return (
      <Show when={actorGameOver() == true} fallback={
        <div class='flex gap-4 justify-center'>
          <span class="font-emoji">🍿</span> 
          <span>Guess the actor</span>
          <span class="font-emoji">🍿</span>
        </div>
      }>
        <Show when={actorSuccess() == true} fallback={
          <div class='flex gap-4 justify-center'>
            <span class="font-emoji">🎬</span>
            <span>You lost</span>
            <span class="font-emoji">🎬</span>
          </div>
        }>
          <div class='flex gap-4 justify-center'>
            <span class="font-emoji">🎉</span>
            <span>You got it!</span>
            <span class="font-emoji">🎉</span>
          </div>
        </Show>
      </Show>
    )
  }

  // Endscreen component with answer and share button
  const Endscreen = () => {
    return (<div class="flex flex-col gap-2 text-center w-full">
      <div>The answer was:</div>
      <div>
        <a href={`https://themoviedb.org/person/${ACTOR["TMDb ID"]}`} class="text-lg font-bold" target="_blank">
          {ACTOR.Name}
        </a>
      </div>
      <div class="w-full font-emoji">
        <For each={actorGuesses()}>
          {(guess) => {
            return (
              guess == ACTOR.Name ? '🟩' : (guess.trim() === '' ? '🟨' : '🟥')
            );
          }}
        </For>
        <For each={[...Array(6 - actorGuesses().length)]}>
          {() => {
            return (
              '⬛'
            );
          }}
        </For>
      </div>
      <button class="w-min mx-auto p-2 bg-accent rounded text-center shadow text-primary-950 hover:brightness-75 transition" id='shareButton' onclick={shareResult}>Share</button>
      <p>Next Game in: 
        <code>
          {String(timeUntilMidnight().hours).padStart(2, '0')}:
          {String(timeUntilMidnight().minutes).padStart(2, '0')}:
          {String(timeUntilMidnight().seconds).padStart(2, '0')}
        </code>
      </p>
    </div>)
  }

  // Change poster when hint is clicked
  const changePoster = (i: number) => {
    return () => {
      setActorPoster(ACTOR.Credits[i]['image'] || '')
    }
  }

  // InProgress component with clickable actors
  const InProgress = () => {
    return (
      <div class="flex flex-col w-full h-full gap-2">
        <For each={ACTOR.Credits}>
          {(credit, i) => {
            return (
              <Show
                when={i() <= actorGuesses().length}
                fallback={
                  <button class="hidden md:block p-2 bg-primary-800 rounded text-center w-full shadow md:h-full" disabled>
                    ...
                  </button>
                }
              >
                <Show when={credit['image'] == actorPoster()} fallback={
                    <button class="p-2 bg-primary-700 rounded text-center w-full shadow hover:brightness-75 md:h-full" onclick={changePoster(i())}>
                      {credit['title']} ({credit['year']})
                    </button>
                }>
                  <button class="p-2 bg-accent text-primary-900 rounded text-center w-full shadow hover:brightness-75 md:h-full" onclick={changePoster(i())}>
                    {credit['title']} ({credit['year']})
                  </button>
                </Show>
              </Show>
            );
          }}
        </For>
      </div>)
  }

  // Stats component with game stats
  const Stats = () => {
    return <>
      <div class="flex gap-2 justify-center flex-wrap" >
        <For each={Object.entries(actorStats())}>
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

  // Hints component with hints revealed every 2 guesses
  const Hints = () => {
    return (
      <div class="my-2">
        <div class="p-2 font-bold">Hints: {Math.ceil(actorGuesses().length / 2)} / 3</div>
        <div class="flex flex-wrap gap-2 justify-center">
            <Show when={actorGuesses().length >= 1}>
              <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p><strong>Birthplace:</strong> {ACTOR.Hints["Place of Birth"]}</p>
              </div>
            </Show>
            <Show when={actorGuesses().length >= 3}>
                <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p><strong>Birthdate:</strong> {ACTOR.Hints.Birthdate}</p>
              </div>
            </Show>
            <Show when={actorGuesses().length >= 5}>
              <div class="p-2 bg-primary-700 rounded text-center shadow">
                <p><strong>Gender:</strong> {ACTOR.Hints.Gender}</p>
              </div>
            </Show>
        </div>
    </div>
    )
  }

  // GameScreen component with title, poster, and stats
  const GameScreen = () => {
    return (
      <>
        <div class="text-center w-full">
          <p class='my-1 text-3xl font-bold'>
            <Title />
          </p>
          <div class="flex flex-col md:flex-row items-center md:aspect-[16/9] my-2 gap-2">
            <img 
              src={actorPoster()} alt={actorGuesses().length != 6 ? ACTOR.Credits[actorGuesses().length]['title'] : ACTOR.Name} 
              class="object-cover rounded mx-auto max-h-[300px] md:max-h-none md:aspect-[2/3] md:h-full" 
            />
            <Show when={actorGameOver() == true} fallback={
              <InProgress />
              }>
                <Endscreen />
            </Show>
          </div>
          <Show when={!actorGameOver()} fallback={
            <a href='/movies' class="inline-block mx-auto m-2 p-2 bg-accent rounded text-center shadow text-primary-950 hover:brightness-75 no-underline">
              <span class="font-emoji">🎞️</span> Play <span class="font-display">KINO</span> movies
            </a>
          }>
            <Hints />
          </Show>
          <hr class="border-accent" />
          <div class="mt-2" >
            <Show when={actorGameOver() == true} fallback={
              <CustomSelect guess={actorGuess} setGuess={setActorGuess} options={actorNames} />
            }>
              <Stats />
            </Show>
          </div>
          <Show when={actorGuesses().length > 0 && !actorGameOver()}>
            <div class='mt-2'>
              <Guesses />
            </div>
          </Show>
        </div>
      </>
    );
  };

  // Footer component with links
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

  // GiveUp button
  const GiveUp = () => {
    return (
      <button class="mx-auto p-2 bg-accent rounded text-center shadow text-primary-950 hover:brightness-75 transition" onclick={() => {
        setActorPoster(ACTOR.Headshot)
        setActorSuccess(false);
        updateStats();
        setActorGameOver(true);
      }}>Give up</button>
    )
  }

  return (
    <>
      <div class="w-screen bg-primary-900 text-primary-100">
        <div class="p-2 max-w-screen-sm 2xl:1/3 mx-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="font-emoji text-4xl">📼</div>
            <h1 class="text-4xl font-bold text-accent font-display">
            <a href="/" class="no-underline">KINO</a>
            </h1>
            <a title="play KINO movies" href="/movies" class="font-emoji text-3xl no-underline grayscale brightness-75">🎞️</a>
            <div title="play KINO actors" class="font-emoji text-3xl no-underline">🎭</div>
            <div class="flex gap-2 ml-auto">
              <Modal Icon={AboutIcon} title="About" >
              <p>
                Each day a new actor is chosen from a curated list, and the hints are based on the top 6 credits (in reverse order), as well as other trivia provided by the <a target="_blank" href="https://developer.theactordb.org/reference/intro/getting-started">TMDB API</a>.
              </p>
              <p>
                Built with <a target="_blank" href="https://solidjs.com/">SolidJS</a> and <a target="_blank" href="https://tailwindcss.com/">Tailwind CSS</a>.
              </p>
              </Modal>
              <Modal Icon={InfoIcon} title="How to play">
              <ul>
                <li>
                  Use the hints provided to guess an actor.
                </li>
                <li>
                  If you guess incorrectly, another credit and/or another hint the actor has will be revealed.
                </li>
                <li>
                  Leave the input blank to skip a guess and get the next hint.
                </li>
                <li>
                  You have 6 guesses to guess the actor.
                </li>
              </ul>
              </Modal>
              <Modal Icon={ChartIcon} title="Stats">
                <Stats />
              </Modal>
            </div>
          </div>

          <hr class="border-accent"/>

          <GameScreen />
          <Show when={actorGameOver() == false}>
            <GiveUp />
          </Show>

          <Footer />
        </div>
      </div>
    </>
  )
}