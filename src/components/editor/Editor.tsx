import { createSignal } from "solid-js"
import em from '../../Editor.module.css';

// обработчики https://docs.solidjs.com/concepts/components/event-handlers


type TEditorProp = {
  cssModule?: CSSModuleClasses[string],
  children?: {
    ids: number[],
    rows: string[],
  }
}

export default function Editor({ cssModule = em.editor, children = { ids: [0], rows: [''] } }: TEditorProp) {


  function click(e: MouseEvent) {
    getPosition()
  }


  function keydown(e: KeyboardEvent) {
    if (e.code === 'Tab') {
      e.preventDefault()

      //  взять количество символов до начала строки
      //  поделить на 4, взять остаток от деления или 4
      //  добаить 

    } else if (e.code === 'Delete') {

      // взять символ после курсора
      console.log(e.code)

    }
    else if (e.code === 'Backspace') {

      // взять символ перед за курсором
      console.log(e.code)
    }
  }



  function keyup(e: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Delete', 'Backspace'].includes(e.code)) {
      getPosition() // получить строку
    }


    if (['Enter', 'Delete', 'Backspace'].includes(e.code)) {
      console.log('keyup', e.code, 'добавить строку')
    }


    if (e.code === 'Tab' && !e.shiftKey) {      // console.log('keyup', e.code, 'подвинуть правee', '| emmet')
    }
    else if (e.code === 'Tab' && e.shiftKey) {      // console.log('keyup', e.code, 'подвинуть левее')
    }

  }



  function paste(e: ClipboardEvent) { }
  function input(e: InputEvent) { }
  function focus(e: FocusEvent) { }


  let content!: HTMLDivElement;
  let debugt!: HTMLDivElement;

  const [max, setMax] = createSignal(Math.max.apply(null, children.ids));
  const [ids, setIds] = createSignal(children.ids)
  const [line, setLine] = createSignal(0)



  function getPosition() {
    const sel = document.getSelection()
    if (!content.firstChild) return;
    if (!sel || !sel.anchorNode) return;

    debugTree(); // отрисовать дебаг

    // проверить наличие выделения мышкой
    // console.log(sel.isCollapsed)


    // создать диапозон
    const range = new Range();
    range.setStartBefore(content.firstChild); // от начала документа
    range.setEnd(sel.anchorNode, sel.anchorOffset); // до позиции курсора
    
    sel.addRange(range); // применить диапозон
    const text = range.cloneContents().textContent; // скопировать текст диапозона

    const line = text?.split("\n").length || 0;

    setLine(line);
  }





  function debugTree() {
    debugt.innerHTML = '';
    const sel = document.getSelection()


    content.childNodes.forEach(node => {
      const name = document.createElement("div") // для каждого дочернего узла в редакторе
      name.setAttribute('css-node-name', '')
      name.appendChild(document.createTextNode(node.nodeName))

      const value = document.createElement("div")
      value.setAttribute('css-node-value', '')

      let nodeValue = String(node.nodeValue)
      if (node === sel?.anchorNode) {
        nodeValue = nodeValue.substring(0, sel.anchorOffset) + '|' + nodeValue.substring(sel.anchorOffset) // нарисовать курсор
      }
      nodeValue = nodeValue.replace(/\n/g, '{n}') // нарисовать перевод строки
      value.appendChild(document.createTextNode(nodeValue))

      const div = document.createElement("div")
      div.appendChild(name)
      div.appendChild(value)
      debugt.appendChild(div)
    });
  }




  return (
    <div class={cssModule}>
      <div css-area>
        <div css-ids>{ids().join("\n")}</div>
        <div ref={content} css-editor contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onKeyDown={keydown} onFocus={focus} onClick={click} >{children.rows.join("\n")}</div>
        <div>
          <div css-line>
            <span>line: {line()}</span>
            <span>node: ?</span>
            <span>offset: ?</span>
          </div>
          <div ref={debugt} css-debugt />
        </div>
      </div>
    </div>
  )
}

