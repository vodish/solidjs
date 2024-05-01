import { createSignal } from "solid-js"
import { unwrap } from "solid-js/store";
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
  let _content!: HTMLDivElement;
  let _debug!: HTMLDivElement;
  let _max = Math.max.apply(null, children.ids);
  let _ids = children.ids;
  let _line = 0;
  let _lineWas = 0;
  let _lines = 0;
  let _linesWas = 0;
  let _ancorOffset = 0;
  let _startNode: HTMLElement | Node = document.body;
  let _startOffset = -1;

  const [ids, setIds] = createSignal(_ids)
  const [line, setLine] = createSignal(_line) // номер строки
  const [lineWas, setLineWas] = createSignal(_lineWas) // номер строки был
  const [lines, setLines] = createSignal(_lines) // количество строк
  const [linesWas, setLinesWas] = createSignal(_linesWas) // количество строк было
  const [anchorOffset, setAnchorOffset] = createSignal(_ancorOffset)
  const [startNode, setStartNode] = createSignal(_startNode)
  const [startOffset, setStartOffset] = createSignal(-1)



  function click(e: MouseEvent) {
    getPosition()
  }

  function keyup(e: KeyboardEvent) {
    // console.log(e.code);

    // получить позицию
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'NumpadEnter', 'Delete', 'Backspace', 'KeyZ'].includes(e.code)) {
      getPosition()
    }

    // добавить строки
    if (['Enter', 'NumpadEnter'].includes(e.code)) {
      insertRow()
    }

    if (['Delete', 'Backspace'].includes(e.code)) {
      console.log('удалить строки', _lines, _linesWas)
      // deleteRow(e.code)
    }


    if (e.code === 'Tab' && !e.shiftKey) {      // добавить пробелы к строкам или emmet
    }
    else if (e.code === 'Tab' && e.shiftKey) {      // удалить пробелы у строк
    }

  }

  function paste(e: ClipboardEvent) { }

  function input(e: InputEvent) { }

  function focus(e: FocusEvent) { }




  function getPosition() {
    const sel = document.getSelection()
    if (!sel || !sel.anchorNode) return;

    if (!_content.firstChild) {
      _content.appendChild(document.createTextNode('\n'));
    }

    // вычислить начало строки: узел и позицию
    searchStart(sel.anchorNode, sel.anchorOffset);

    // отрисовать дерево узлов в дебаге
    debugTree();

    // проверить наличие выделения мышкой
    // console.log(sel.isCollapsed)

    // установить смещение для отрисовки в дебаге
    setAnchorOffset(sel.anchorOffset)

    // всего строк
    setLinesWas(_linesWas = _lines);
    setLines(_lines = _content.textContent?.split("\n").length || 0)

    // создать диапозон для определения номера строки
    const range = new Range();
    range.setStartBefore(_content.firstChild as Node); // от начала документа
    range.setEnd(sel.anchorNode, sel.anchorOffset); // до позиции курсора

    sel.addRange(range); // применить диапозон
    const textBefore = range.cloneContents().textContent; // скопировать текст диапозона
    const lineNum = textBefore?.split("\n").length || 0;

    setLineWas(_line = _line === 0 ? _line : lineNum)
    setLine(_line = lineNum)
  }

  function searchStart(node: Node, offset: number = -1) {
    const content = node.textContent || '';
    setStartOffset(_startOffset = -1);

    for (var pos = offset; pos > -1; pos--) { // найти \n в текущем узле
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
      else if (!parentNode.hasAttribute('css-editor')) { // если узел выше не корневой
        searchStart(parentNode, parentNode.textContent?.length)
      }
      else if (node.parentNode) { // иначе это первый узел от корня
        setStartOffset(0)
        setStartNode(node.parentNode)
      }
    }
  }

  function debugTree() {
    _debug.innerHTML = '';
    const sel = document.getSelection()

    _content.childNodes.forEach(node => {
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
      _debug.appendChild(div)
    });
  }

  function insertRow() {
    let one = unwrap(ids())
    let two: number[] = []
    let three = one.splice(lineWas())
    for (let i = line() - lineWas(); i > 0; i--) {
      two.push(++_max);
    }
    setIds([...one, ...two, ...three]);
  }

  function deleteRow(keyCode: string) {

    console.log(lines(), lineWas())

    if (keyCode === 'Backspace' && lines() < lineWas()) {
      let rows = unwrap(ids())
      let remove = rows.splice(lines(), lineWas() - lines())
      console.log(rows)
      console.log(remove)
    }
    else if (keyCode === 'Delete') {

    }
  }

  return (
    <div class={cssModule}>
      <div css-ids>{ids().join("\n")}</div>
      <div ref={_content} css-editor contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onFocus={focus} onClick={click} >{children.rows.join("\n")}</div>
      <div css-tth>
        <div>lines: {lines()} ({linesWas()})</div>
        <div>line: {line()} ({lineWas()})</div>
        <div>anchorOffset:{anchorOffset()}</div>
        <div>startNode:{startNode().nodeName}</div>
        <div>startOffset:{startOffset()}</div>
      </div>
      <div ref={_debug} css-debugt />
    </div>
  )
}

