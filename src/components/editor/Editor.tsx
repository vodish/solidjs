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
    // console.log(e.code);
    
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'NumpadEnter', 'Delete', 'Backspace', 'KeyZ'].includes(e.code)) {
      getPosition()
    }


    if (['Enter', 'NumpadEnter'].includes(e.code)) {
      addRow()
    }

    if (['Delete', 'Backspace'].includes(e.code)) {
      console.log('keyup', e.code, 'удалить строку?')
    }


    if (e.code === 'Tab' && !e.shiftKey) {      // добавить пробелы к строкам или emmet
    }
    else if (e.code === 'Tab' && e.shiftKey) {      // удалить пробелы у строк
    }

  }

  function paste(e: ClipboardEvent) { }

  function input(e: InputEvent) { }

  function focus(e: FocusEvent) { }


  let content!: HTMLDivElement;
  let debugt!: HTMLDivElement;

  const [max, setMax] = createSignal(Math.max.apply(null, children.ids));
  const [ids, setIds] = createSignal(children.ids)
  const [line0, setLine0] = createSignal(0)
  const [line1, setLine1] = createSignal(0)
  const [anchorOffset, setAnchorOffset] = createSignal(0)
  const [startNode, setStartNode] = createSignal<HTMLElement|Node>(document.body)
  const [startOffset, setStartOffset] = createSignal(-1)



  function getPosition() {
    const sel = document.getSelection()
    if (!sel || !sel.anchorNode) return;
    
    if (!content.firstChild) {
      content.appendChild(document.createTextNode('\n'));
    }

    // вычислить начало строки: узел и позицию
    searchStart(sel.anchorNode, sel.anchorOffset);

    // отрисовать дерево узлов в дебаге
    debugTree();

    // проверить наличие выделения мышкой
    // console.log(sel.isCollapsed)

    // установить смещение для отрисовки в дебаге
    setAnchorOffset(sel.anchorOffset)
    

    // создать диапозон для определения номера строки
    const range = new Range();
    range.setStartBefore(content.firstChild as Node); // от начала документа
    range.setEnd(sel.anchorNode, sel.anchorOffset); // до позиции курсора

    sel.addRange(range); // применить диапозон
    const text = range.cloneContents().textContent; // скопировать текст диапозона
    const line = text?.split("\n").length || 0;

    if (line1() == 0) {
      setLine0(line);
      setLine1(line);
    } else {
      setLine0(line1())
      setLine1(line)
    }
  }

  function searchStart(node: Node, offset: number = -1) {
    const content = node.textContent || '';
    setStartOffset(-1);

    for (var pos = offset; pos > -1; pos--) { // найти \n в текущем узле
      // console.log(pos, content.substring(pos - 1, pos) === "\n")
      if (content.substring(pos - 1, pos) === "\n") {
        setStartOffset(pos)
        setStartNode(node)
        break;
      }
    }

    if (pos < 0) {
      const parentNode = node.parentNode as HTMLElement;

      if (node.previousSibling) {  // есть узел слева
        searchStart(node.previousSibling, node.previousSibling.textContent?.length)
      }
      else if ( !parentNode.hasAttribute('css-editor') ) { // если узел выше не корневой
        searchStart(parentNode, parentNode.textContent?.length)
      }
      else if (node.parentNode) { // иначе это первый узел от корня
        setStartOffset(0)
        setStartNode(node.parentNode )
      }
    }
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

      let nodeValue = String(node.nodeValue);
      // нарисовать курсор
      if (node === sel?.anchorNode) {
        nodeValue = nodeValue.substring(0, sel.anchorOffset) + '|' + nodeValue.substring(sel.anchorOffset)
      }
      // нарисовать перевод строки
      nodeValue = nodeValue.replace(/\n/g, '{n}')
      //
      value.appendChild(document.createTextNode(nodeValue))

      const div = document.createElement("div")
      div.appendChild(name)
      div.appendChild(value)
      debugt.appendChild(div)
    });
  }

  function addRow() {
    console.log(`добавить:${line0()}-${line1()}`)
  }



  return (
    <div class={cssModule}>
      <div css-ids>{ids().join("\n")}</div>
      <div ref={content} css-editor contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onKeyDown={keydown} onFocus={focus} onClick={click} >{children.rows.join("\n")}</div>
      <div css-tth>
        <div>line: {line0()},{line1()}</div>
        <div>anchorOffset:{anchorOffset()}</div>
        <div>startNode:{startNode().nodeName}</div>
        <div>startOffset:{startOffset()}</div>
      </div>
      <div ref={debugt} css-debugt />
    </div>
  )
}

