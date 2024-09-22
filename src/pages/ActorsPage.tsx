import { useState, useRef } from "react";

import Layout from "../layout/Layout"
import ActorModal from "../components/modals/ActorModal"
import actors from "../assets/actors.json"
// import getTimeUntilMidnight from "../helpers/timeUntilMidnight";
import getDay from "../helpers/getDay";
import GuessBox, { GuessOption } from "../components/GuessBox";
import StatsModal from "../components/modals/StatsModal";

// interface actorStats {
//   gamesPlayed: number;
//   gamesWon: number;
//   winPercentage: string;
//   streak: number;
//   maxStreak: number;
// }

function ActorsPage() {
  const ACTOR = useRef(actors[getDay() % actors.length])
  // const [ actorGuess, setActorGuess ] = useState<string>('')
  // const [ actorPoster, setActorPoster ] = useState<string>(ACTOR.current.Credits[0]['image'] || '')
  // const [ actorGuesses, setActorGuesses ] = useState<string[]>([])
  // const [ actorSuccess, setActorSuccess ] = useState<boolean>(false)
  // const [ actorStats, setActorStats ] = useState<actorStats>({
  //   gamesPlayed: 0,
  //   gamesWon: 0,
  //   winPercentage: '0%',
  //   streak: 0,
  //   maxStreak: 0,
  // });
  // const [ timeUntilMidnight, setTimeUntilMidnight ] = useState(getTimeUntilMidnight());
  // const [ actorGameOver, setActorGameOver ] = useState(false);

  const actorOptions: GuessOption[] = actors.map(actor => ({
    value: actor["TMDb ID"].toString(),
    label: actor.Name
  }));

  const Title = <div className="flex gap-2 justify-between items-center">
    <div>
      <StatsModal />
    </div>
    <div className="flex gap-2 text-xl">
      <span className="">Guess the actor</span>
    </div>
    <div>
      <ActorModal />
    </div>
  </div>

  return (
    <Layout modals={[<ActorModal key="actorsModal" />]}>
        <div className="flex flex-col gap-2 w-full">
          {Title}
          <div className="flex flex-wrap gap-2">
            <img src={ACTOR.current.Credits[0].image} alt={ACTOR.current["TMDb ID"].toString()} className="flex-0 rounded-btn bg-base-200 w-1/3"/>
            <div className="flex flex-col w-full flex-1 gap-2">
              {ACTOR.current.Credits.map(credit => {
                return <button className="btn text-center" key={credit.title}>
                  {credit.title}
                </button>
              })}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <GuessBox options={actorOptions} />
          <button className="btn btn-primary">Guess</button>
        </div>
    </Layout>
  )
}

export default ActorsPage