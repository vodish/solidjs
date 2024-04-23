/*
обработчики
  https://docs.solidjs.com/concepts/components/event-handlers
*/


type TEditorProp = {
  cssClass?: string
  children?: string
}



export default function Editor({ cssClass, children = '' }: TEditorProp) {

  function keydown(e: KeyboardEvent) {
    if (e.code === 'Tab') {
      e.preventDefault()
    }
  }

  function keyup(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      console.log('keyup', e.code, 'добавить строку')
    }
    
    if (e.code === 'Tab' && !e.shiftKey) {
      console.log('keyup', e.code, 'подвинуть правee')
    }
    else if (e.code === 'Tab' && e.shiftKey) {
      console.log('keyup', e.code, 'подвинуть левее')
    }
    
    if (['ArrowLeft', 'ArrowRight'].includes(e.code)) {
      console.log('keyup', e.code, 'pos: ')
    }
    
    if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
      console.log('keyup', e.code, 'row: ')
    }
    
  }

  function paste(e: ClipboardEvent) {
    console.log('paste')
    // e.preventDefault()
    const content = e.clipboardData?.getData('text/plain') // содержит вставляемые символы
    console.log(content)

  }

  function input(e: InputEvent) {
    // console.log('input')
    // console.log(e.data) // содержит введенный текст: один символ или несколько, через вставку
    // console.log(e)
  }


  return <div class={cssClass} contenteditable="plaintext-only"
    onPaste={paste}
    onInput={input}
    onKeyUp={keyup}
    onKeyDown={keydown}
  >{children}</div>
}
