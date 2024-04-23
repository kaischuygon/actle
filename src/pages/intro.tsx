import Modal from "../components/modal"
import Footer from "../components/footer"
import AboutIcon from "~icons/bx/bxs-info-circle"

export default () => {
  return (
    <>
      <div class="w-screen bg-primary-900 text-primary-100">
        <div class="p-2 max-w-screen-sm 2xl:1/3 mx-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="font-emoji text-4xl">📼</div>
            <h1 class="text-4xl font-bold text-center text-accent font-display">
            <a href="/" class="no-underline">KINO</a>
            </h1>
            <div class="flex gap-2 ml-auto">
              <Modal Icon={AboutIcon} title="About" >
                <p>
                    Games for film buffs and casual moviegoers alike. Inspired by <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank">wordle</a>, but for movies.
                </p>
                <p>
                    Built with <a target="_blank" href="https://solidjs.com/">SolidJS</a> and <a target="_blank" href="https://tailwindcss.com/">Tailwind CSS</a>.
                </p>
              </Modal>
            </div>
          </div>

          <hr class="border-accent"/>

          <div class="flex flex-col gap-2">
            <a href="/movies" class="w-full bg-primary-800 rounded flex gap-2 items-center no-underline p-2 hover:brightness-90">
                <div class="text-6xl font-emoji">
                🎞️
                </div>
                <div class="text-primary-50">
                    <div class="text-2xl font-display">movies</div>
                    <div class="text-xs">Guess the movie from the castlist.</div>
                </div>
            </a>
            <a href="/actors" class="w-full bg-primary-800 rounded flex gap-2 items-center no-underline p-2 hover:brightness-90">
                <div class="text-6xl font-emoji">
                🎭
                </div>
                <div class="text-primary-50">
                <div class="text-2xl font-display">actors</div>
                    <div class="text-xs">Guess the actor from the filmography.</div>
                </div>
            </a>
            <span class="w-full bg-primary-800 rounded flex gap-2 items-center no-underline p-2 brightness-75">
                <div class="text-6xl font-emoji">
                ✨
                </div>
                <div class="text-primary-50">
                <div class="text-2xl font-display">more</div>
                    <div class="text-xs">More games coming soon! Stay tuned.</div>
                </div>
            </span>
          </div>
          <hr class="border-accent" />

          <Footer />
        </div>
      </div>
    </>
  )
}