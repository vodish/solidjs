import { createSignal, JSX, onMount } from "solid-js"
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
    
    console.log('keyup', e.code, 'добавить строку')
    if (e.code === 'Enter') {
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



  function paste(e: ClipboardEvent) { }

  function input(e: InputEvent) {
    setDebug()
  }


  let content!: HTMLDivElement;
  let debug!: HTMLDivElement;


  const [max, setMax] = createSignal(Math.max.apply(null, children.ids));
  const [ids, setIds] = createSignal(children.ids)
  const [line, setLine] = createSignal(0)

  onMount(() => {
    setDebug();
  })

  function getPosition() {
    const sel = document.getSelection()
    if (!content.firstChild) return;
    if (!sel || !sel.anchorNode) return;

    // проверить наличие выделения мышкой
    // console.log(sel.isCollapsed)

    const range = new Range();
    range.setStartBefore(content.firstChild); // от начала документа
    range.setEnd(sel.anchorNode, sel.anchorOffset); // до позиции курсора

    // применим выделение, объясняется далее
    // sel.isCollapsed
    // sel.removeAllRanges(); // снять выделение, на всякий случай
    sel.addRange(range); // добавить выделение до текущего курсора
    const text = range.cloneContents().textContent; // скопировать текст до курсора

    if (sel.isCollapsed) {
      range.collapse(false); // свернуть выделение к курсору
    }

    const line = text?.split("\n").length || 0;

    setLine(line);
  }

  function focus(e: FocusEvent) {
    console.log(content.childNodes)
  }


  function setDebug() {
    debug.innerHTML = '';

    content.childNodes.forEach(node => {
      const name = document.createElement("div")
      name.setAttribute('css-node-name', '');
      name.appendChild(document.createTextNode(node.nodeName));

      const value = document.createElement("div")
      value.setAttribute('css-node-value', '');
      const nodeValue = String(node.nodeValue).replace(/\n/g, '{n}')
      value.appendChild(document.createTextNode(nodeValue));

      const div = document.createElement("div");
      div.appendChild(name)
      div.appendChild(value)
      debug.appendChild(div)
    });
  }


  return (
    <div class={cssModule}>
      <div css-area>
        <div css-ids>{ids().join("\n")}</div>
        <div ref={content} css-editor contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onKeyDown={keydown} onFocus={focus} onClick={click} >{children.rows.join("\n")}</div>
        <div>
          <div css-line>line: {line()}</div>
          <div ref={debug} css-nodes />
        </div>
      </div>
    </div>
  )
}

