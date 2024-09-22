import Layout from "../layout/Layout"
import games from '../assets/games.json'

function IndexPage() {
  return (
    <Layout>
        {games.map(game => {
          return (
            <div className="card card-side bg-base-100 shadow-xl p-2" key={game.name}>
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
        <div className="card card-side p-2">
          <figure className="text-[5em] font-emoji">
            ⏳
          </figure>
          <div className="card-body prose">
            <h2 className="card-title capitalize">More coming soon</h2>
            <p>Check back soon for new puzzles! <a href="https://github.com/kaischuygon/kino.wtf/issues" target="_blank">Any suggestions?</a></p>
          </div>
        </div>
    </Layout>
  )
}

export default IndexPage
