
type TEditorProp = {
  cssClass?: string
  children?: string
}



export default function Editor({ cssClass, children ='' }: TEditorProp) {
  
  function keyup(e: KeyboardEvent) {
    console.log(e.code)
    console.log('keyup')
  }

  function paste(e: ClipboardEvent) {
    console.log('paste')
    // e.preventDefault()
    const content = e.clipboardData?.getData('text/plain') // содержит вставляемые символы
    console.log(content)
    
  }
  
  function input(e: InputEvent) {
    console.log('input')
    // console.log(e.data) // содержит введенный текст: один символ или несколько, через вставку
    console.log(e)
  }


  return <div class={cssClass} contenteditable="plaintext-only"
    onPaste={paste}
    onInput={input}
    onKeyUp={keyup}
    >{children}</div>
}
