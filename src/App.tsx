import { Show, For } from "solid-js"
import { createSignal } from "solid-js";

import Modal from "./components/modal"
import AboutIcon from "~icons/bx/bxs-info-circle"
import InfoIcon from "~icons/bx/bxs-book-open"
import GitHubIcon from "~icons/bx/bxl-github"
import logo from "./assets/kino.svg"


const FILM = "The Matrix"

const HINTS = [
  'Keanu Reeves',
  'Laurence Fishburne',
  'Carrie-Anne Moss',
  'Hugo Weaving',
  'Lana Wachowski',
  'Lilly Wachowski'
]

function App() {
  const [guesses, setGuesses] = createSignal<number>(0)
  const [success, setSuccess] = createSignal<boolean>(false)

  function makeGuess() {
    return (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const input = e.target as HTMLInputElement;
        const guess = input.value.toLowerCase();

        setGuesses((prev: number) => {
          return prev + 1;
        });

        if (guess === FILM.toLowerCase()) {
          setSuccess(true);
        }

        if (guesses() == 6) {
          input.disabled = true;
          input.placeholder = "Better luck next time 😢";
        }

        input.value = "";
      }
    };
  }

  return (
    <>
      <div class="w-screen h-screen overflow-hidden bg-primary-900 text-primary-100">
        <div class="p-2 w-full md:w-1/2 xl:w-1/3 mx-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <img src={logo} class="h-8" />
            <h1 class="text-4xl font-bold text-center text-accent-400 font-display">kino</h1>
            <div class="flex gap-2 justify-center items-center ml-auto">
              <a target="_blank" href="https://github.com/kaischuygon/actle"><GitHubIcon class="text-lg text-primary-100" /></a>
              <Modal Icon={AboutIcon} title="About" >
                <p>
                  A game for film buffs and casual moviegoers alike. Inspired by wordle, but for movies.
                </p>
                <p>
                  Each day a new movie is chosen from a curated list, and the hints are based on the top 6 actors provided by the <a target="_blank" href="https://developer.themoviedb.org/reference/intro/getting-started">TMDB API</a>.
                </p>
                <p>
                  All rights go to the rightful owners, this is just a fun project.
                </p>
              </Modal>
              <Modal Icon={InfoIcon} title="How to play">
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
              </Modal>
            </div>
          </div>
          
          <hr class="border-accent-400"/>

          <Show when={guesses() == 6 || success() == true} fallback={
            <>
              <For each={HINTS}>
                {(hint, i) => {
                  return (
                    <Show
                      when={i() <= guesses()}
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
              <input
                type="text"
                class="w-full p-2 bg-primary-800 text-primary-100 mx-auto block rounded"
                placeholder="🍿 Guess a movie..."
                onkeypress={makeGuess()}
              />
            </>
          }>
            <div class="p-2 bg-primary-800 rounded text-center w-full shadow">
              {
                success() == true ?
                  <p>🎉 You got it!</p> :
                  <p>The answer was {FILM}. 😢 Better luck next time!</p>
              }
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}

export default App
