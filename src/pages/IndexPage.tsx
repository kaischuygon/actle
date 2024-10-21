import Layout from "../layout/Layout"
import games from '../assets/games.json'

function IndexPage() {
  return (
    <Layout>
        {games.map(game => {
          return (
            <a href={game.link} className="btn justify-start h-[8em] gap-2 shadow" key={game.name}>
              <div className="text-[4em] font-emoji">
                {game.emoji}
              </div>
              <div className="prose text-left">
                <h2 className="capitalize">{game.name}</h2>
                <p>{game.description}</p>
              </div>
            </a>
          )})
        }
        <div className="btn btn-ghost hover:bg-transparent cursor-default justify-start h-[8em] gap-2">
          <div className="text-[4em] font-emoji">
            ⏳
          </div>
          <div className="prose text-left">
            <h2 className="capitalize">More coming soon</h2>
            <p>Check back soon for new puzzles! <a href="https://github.com/kaischuygon/kino.wtf/issues" target="_blank">Any suggestions?</a></p>
          </div>
        </div>
    </Layout>
  )
}

export default IndexPage;
