import { Accessor, Component, createEffect, createMemo, createSignal, For, JSX, on, onMount, Setter, Show } from 'solid-js';

import Fuse from 'fuse.js'

const MovieSelect: Component<{
  guess: Accessor<string>,
  setGuess: Setter<string>,
  options: Array<string>
}> = (props) => {
  const [text, setText] = createSignal('');
  const [show, setShow] = createSignal(false);
  const [selected, setSelected] = createSignal(0);

  // Super simple fuzzy search using fuse.js
  const fuse = new Fuse(props.options, {threshold: 0.2})
  const filteredOptions = () => fuse.search(text()).map(el => el.item);
    

  const isVisible = createMemo(() => {
    return show() && (filteredOptions().length > 1 || filteredOptions()[0] !== text());
  });

  createEffect(on(text, () => {
    setSelected(0);
  }));

  createEffect(on(props.guess, () => {
    setText('')
    setShow(false)
  }));

  onMount(() => {
    document.getElementById('movieSelectInput')?.focus()
  });

  const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    setText(event.currentTarget.value);
  };

  const handleKeydown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.code === 'ArrowUp') {
      setSelected(prev => prev === 0 ? (filteredOptions().length - 1) : prev - 1);
    } else if (event.code === 'ArrowDown') {
      setSelected(prev => prev + 1 === filteredOptions().length ? 0 : prev + 1);
    } else if (event.code === 'Tab') {
      setText(filteredOptions()[selected()]);
      // prevent default tab behaviour
      event.preventDefault();
    } else if (event.code === 'Enter') {
      const input = document.getElementById('movieSelectInput') as HTMLInputElement;
      setText(filteredOptions()[selected()] ? filteredOptions()[selected()] : input.value);
      props.setGuess(text());
    } 
    setShow(true);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="🍿 Guess a movie..."
        class="w-full p-2 bg-primary-800 text-primary-100 mx-auto block rounded"
        value={text()}
        onInput={handleInput}
        onKeyDown={handleKeydown}
        onBlur={() => setShow(false)}
        id='movieSelectInput'
      />
      <Show when={isVisible()}>
        <ul class="outline outline-1 outline-accent-300 rounded max-h-48 overflow-y-auto w-full overflow-x-clip">
          <For each={filteredOptions()}>
            {(item, i) => <li class={ selected() === i() ? 'p-2 bg-primary-700': 'p-2'}>{item}</li>}
          </For>
        </ul>
      </Show>
    </div>
  );
};

export default MovieSelect;