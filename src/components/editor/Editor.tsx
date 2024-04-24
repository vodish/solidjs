/*
обработчики
  https://docs.solidjs.com/concepts/components/event-handlers
*/

import { createSignal } from "solid-js"


type TEditorProp = {
  cssClass?: string
  children?: {
    ids: number[],
    rows: string[],
  }
}



export default function Editor({ cssClass, children = { ids: [0], rows: [''] } }: TEditorProp) {

  const [ max, setMax ] = createSignal(Math.max.apply(null, children.ids));
  const [ ids, setIds ] = createSignal(children.ids)
  const [ rows, setRows ] = createSignal(children.rows)

  console.log(max())
  console.log(ids())
  console.log(rows())

  // setRow(children);



  function keydown(e: KeyboardEvent) {
    if (e.code === 'Tab') {
      e.preventDefault()
      // взять количество символов до начала строки
      //  поделить на 4, взять остаток от деления или 4
      // добаить 
    }
  }

  function keyup(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      // console.log('keyup', e.code, 'добавить строку')
    }

    if (e.code === 'Tab' && !e.shiftKey) {
      // console.log('keyup', e.code, 'подвинуть правee', '| emmet')
    }
    else if (e.code === 'Tab' && e.shiftKey) {
      // console.log('keyup', e.code, 'подвинуть левее')
    }

    if (['ArrowLeft', 'ArrowRight'].includes(e.code)) {
      // console.log('keyup', e.code, 'pos: ')
    }

    if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
      // console.log('keyup', e.code, 'row: ')
    }

  }

  function paste(e: ClipboardEvent) {
    console.log('paste')
    // e.preventDefault()
    const content = e.clipboardData?.getData('text/plain') // содержит вставляемые символы
    console.log('вставка', content)

  }

  function input(e: InputEvent) {
    // console.log('input')
    // console.log(e.data) // содержит введенный текст: один символ или несколько, через вставку
    // console.log(e)
  }


  function focus(e: FocusEvent) {
    console.log(e);
  }



  return (
    <div class={cssClass} style={{ display: "flex", gap: '1ch' }}>
      <div style={{ "color": '#ccc', "border-right": 'solid 1px #eee', "padding-right": '0.5ch', "white-space": 'pre' }}>{ids().join("\n")}</div>
      <div style={{ "flex-grow": '1', outline: 'none' }} contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onKeyDown={keydown} onFocus={focus} >{rows().join("\n")}</div>
    </div>
  )
}
