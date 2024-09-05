import Navbar from "./layout/Navbar"
import { BsGithub } from "react-icons/bs"
import games from './assets/games.json'

function App() {
  const footer = [
    <span className="prose inline-flex gap-2">
      © 2024
      <a href="https://kaischuyler.com" target="_blank">Kai Schuyler</a>
    </span>,
    <span className="inline-flex gap-2 items-center prose">
      <span className="font-emoji">☕️</span>
      <a href="https://www.buymeacoffee.com/kaischuyler" target="_blank">buy me a coffee</a>
    </span>,
    <span className="inline-flex gap-2 items-center prose">
      <BsGithub /> 
      <a href="https://github.com/kaischuygon/kino.wtf" target="_blank">source</a>
    </span>,
    <span className="inline-flex gap-2 items-center prose">
      <a href="https://github.com/kaischuygon/kino.wtf/issues" target="_blank">issues?</a>
    </span>,
  ]

  return (
    <div className="max-w-screen-sm mx-auto grid grid-rows-[0fr_1fr_0fr] min-h-screen">
      <div className="border-neutral border-[1px]">
        <Navbar />
      </div>
      <div className="border-neutral border-[1px] flex flex-col gap-2 p-2">
        {games.map(game => {
          return (
            <div className="card lg:card-side bg-base-300 shadow-xl p-2">
              <figure className="text-[5em] font-emoji">
                {game.emoji}
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize">{game.name}</h2>
                <p>{game.description}</p>
                <div className="card-actions justify-end">
                  <a className="btn btn-primary" href={game.link}>Play now</a>
                </div>
              </div>
            </div>
          )})
        }
        <div className="card lg:card-side bg-base-200 shadow-xl p-2">
          <figure className="text-[5em] font-emoji">
            ⏳
          </figure>
          <div className="card-body prose">
            <h2 className="card-title capitalize">More coming soon</h2>
            <p>Check back soon for new puzzles! <a href="https://github.com/kaischuygon/kino.wtf/issues" target="_blank">Any suggestions?</a></p>
          </div>
        </div>
      </div>
      <div className="border-neutral border-[1px] flex gap-2 justify-center items-center p-2">
        {footer.map((footerObj, i) => {
          return <>
            {footerObj}
            {i < footer.length - 1 && ' • '}
          </>
        })}
      </div>
    </div>

  )
}

export default App
