/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import './index.css'
import Intro from './assets/intro'
import Movies from './assets/movies'
import Actors from './assets/actors'
import colors from 'tailwindcss/colors'

const colorArray = [
  colors.amber,
  colors.blue,
  colors.cyan,
  colors.emerald,
  colors.fuchsia,
  colors.green,
  colors.indigo,
  colors.lime,
  colors.orange,
  colors.pink,
  colors.purple,
  colors.red,
  colors.rose,
  colors.sky,
  colors.teal,
  colors.violet,
  colors.yellow,
]

// Choose a color from the array based on the current date
const accentColor = colorArray[new Date().getDate() % colorArray.length];
document.documentElement.style.setProperty('--ACCENT', accentColor[400] as string);

const root = document.getElementById('root')
render(() => (
    <Router>
        <Route path="/movies" component={Movies} />
        <Route path="/actors" component={Actors} />
        <Route path="/" component={Intro} />
        <Route path="/:rest*" component={Intro} />
    </Router>
), root!)