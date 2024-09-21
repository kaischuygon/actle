import Layout from "../layout/Layout"
import ActorModal from "../components/modals/ActorModal"

function ActorsPage() {
  return (
    <Layout modals={[<ActorModal key='actorsModal' />]}>
        Actors
    </Layout>
  )
}

export default ActorsPage
