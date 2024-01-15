import { Show, For, createEffect, on } from "solid-js"
import { createSignal } from "solid-js";

import Modal from "./components/modal"
import MovieSelect from "./components/movieSelect"
import AboutIcon from "~icons/bx/bxs-info-circle"
import InfoIcon from "~icons/bx/bxs-book-open"

import movies from '../movie_notebook/movies.json'

function App() {
  const [guess, setGuess] = createSignal<string>("")
  const [guesses, setGuesses] = createSignal<string[]>([])
  const [success, setSuccess] = createSignal<boolean>(false)

  createEffect(on(guess, () => {
    setGuesses(prev => [...prev, guess()]);

    if (guess() === FILM.toLowerCase()) {
      setSuccess(true);
    }
  }));

  // Get all movie names
  const movieNames = movies.map(movie => movie.Name + " (" + movie.Year + ")").sort()

  // Choose movie based on client date
  const date = new Date()
  const day = date.getDate()
  const movie = movies[day % movies.length]

  // Set the film and hints
  const FILM = movie.Name
  const HINTS = movie.Actors

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
    return <div class="flex flex-wrap gap-2">
      <For each={guesses()}>
        {(guess) => {
          return (
            <div class="p-2 bg-primary-700 rounded text-center shadow">
              <p>{guess}</p>
            </div>
          );
        }}
      </For>
    </div>
  }
  
  const Success = () => {
    return <>
      <div class="p-2 bg-primary-800 rounded text-center w-full shadow">
        🎉 You got it!
      </div>
      <p>Your guesses: </p>
      <Guesses />
    </>
  }

  const Failure = () => {
    return <>
      <div class="p-2 bg-primary-800 rounded text-center w-full shadow">
        The answer was {FILM}. 😢 Better luck next time!
      </div>
      <p>Your guesses: </p>
      <Guesses />
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
            </div>
          </div>

          <hr class="border-accent-400"/>

          <Show when={guesses().length == 6 || success() == true} fallback={
            <>
              <For each={HINTS}>
                {(hint, i) => {
                  return (
                    <Show
                      when={i() < guesses().length}
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
                <Success /> :
                <Failure />
            }
          </Show>
        </div>
      </div>
    </>
  )
}

export default App
