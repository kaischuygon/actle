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
  const [selected, setSelected] = createSignal(-1);

  // Clean options array
  props.options = props.options.map(cleanText);

  // Super simple fuzzy search using fuse.js
  const fuse = new Fuse(props.options, {threshold: 0.2})
  const filteredOptions = () => fuse.search(text()).map(el => el.item);

  const isVisible = createMemo(() => {
    return show() && (filteredOptions().length > 1 || filteredOptions()[0] !== text());
  });

  createEffect(on(text, () => {
    setSelected(-1);
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
    // remove last 6 characters and trim whitespace if it's a year
    if (title.slice(-6).match(/\d{4}/)) {
      return title.slice(0, -6).trim();
    } else {
      return title;
    }
  }

  const submit = () => {
    if(selected() === -1) {
      props.setGuess((prev) => ' '.repeat(prev.length + 1))
      // props.setGuess((prev) => prev.split(' ').slice(0, -1).join(' '));
    } else {
      setText(filteredOptions()[selected()]);
      props.setGuess(sanitizeText(text()));
    }
  }

  const handleKeydown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    let input = document.getElementById('movieSelectInput') as HTMLInputElement;
    if (event.code === 'ArrowUp') {
      selected() === -1 ? setSelected(0) : (setSelected(prev => prev + 1 === filteredOptions().length ? 0 : prev + 1));
      event.preventDefault()
    } else if (event.code === 'ArrowDown') {
      selected() === -1 ? setSelected(0) : (setSelected(prev => prev + 1 === filteredOptions().length ? 0 : prev - 1));
      event.preventDefault()
    } else if (event.code === 'Tab') {
      input.value = filteredOptions()[0] ? filteredOptions()[0] : text();
      setSelected(filteredOptions()[0] ? 0 : -1);
      event.preventDefault(); // prevent default tab behaviour
    } else if (event.code === 'Enter') {
      submit();
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
    <>
      <div class="flex gap-2">
        <div class="relative w-full">
          <Show when={isVisible()}>
            <ul class="flex flex-col-reverse outline outline-1 outline-accent-300 rounded-t max-h-48 overflow-y-auto w-full overflow-x-clip bg-primary-950 absolute bottom-full" id='options'>
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
        </div>
        <button
          class="bg-accent-400 text-primary-950 hover:brightness-75 p-2 rounded"
          onClick={() => {
            submit();
          }}
        >
          Guess
        </button>
      </div>
    </>
  );
};

export default MovieSelect;