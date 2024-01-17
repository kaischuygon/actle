import { type Accessor, type Component, createEffect, createMemo, createSignal, For, type JSX, on, onMount, type Setter, Show } from 'solid-js';

import Fuse from 'fuse.js'

function cleanText(input:string) {
  let decoder = new TextDecoder('utf-8');
  return decoder.decode(new Uint8Array(input.split('').map(c => c.charCodeAt(0))));
}

const MovieSelect: Component<{
  guess: Accessor<string>,
  setGuess: Setter<string>,
  options: Array<string>
}> = (props) => {
  const [text, setText] = createSignal('');
  const [show, setShow] = createSignal(false);
  const [selected, setSelected] = createSignal(0);

  // Clean options array
  props.options = props.options.map(cleanText);

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

  const sanitizeText = (title:string) => {
    // remove last 6 characters and trim whitespace
    return title.slice(0, -6).trim();
  }

  const handleKeydown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.code === 'ArrowUp') {
      setSelected(prev => prev === 0 ? (filteredOptions().length - 1) : prev - 1);
    } else if (event.code === 'ArrowDown') {
      setSelected(prev => prev + 1 === filteredOptions().length ? 0 : prev + 1);
    } else if (event.code === 'Tab') {
      let input = document.getElementById('movieSelectInput') as HTMLInputElement;
      input.value = sanitizeText(filteredOptions()[selected()]);
      // setText(sanitizeText(filteredOptions()[selected()]));
      event.preventDefault(); // prevent default tab behaviour
    } else if (event.code === 'Enter') {
      const input = document.getElementById('movieSelectInput') as HTMLInputElement;
      setText(filteredOptions()[selected()] ? filteredOptions()[selected()] : input.value);
      props.setGuess(sanitizeText(text()));
    }
    setShow(true);
  }

  let blurTimeout: number;

  const handleBlur = () => {
    // Delay hiding the list by 200ms
    blurTimeout = setTimeout(() => setShow(false), 200);
  };

  const handleFocus = () => {
    // Cancel the hiding if the user focuses back on the input quickly
    clearTimeout(blurTimeout);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="🍿 Guess a movie..."
        class="w-full p-2 bg-primary-800 text-primary-100 mx-auto block rounded placeholder:font-emoji"
        value={text()}
        onInput={handleInput}
        onKeyDown={handleKeydown}
        onBlur={handleBlur} // Use handleBlur instead of inline function
        onFocus={handleFocus} // Add onFocus event handler
        id='movieSelectInput'
      />
      <Show when={isVisible()}>
        <ul class="outline outline-1 outline-accent-300 rounded max-h-48 overflow-y-auto w-full overflow-x-clip" id='options'>
        <For each={filteredOptions()}>
          {(item, i) => (
            <li 
              class={ selected() === i() ? 'p-2 bg-primary-700 font-sans': 'p-2'}
              onMouseOver={() => setSelected(i)} // set selected item on hover
              onClick={() => { // change 'onclick' to 'onClick'
                setText(filteredOptions()[i()]);
                props.setGuess(sanitizeText(text()));
              }}
            >
              {item}
            </li>
          )}
        </For>
        </ul>
      </Show>
    </div>
  );
};

export default MovieSelect;