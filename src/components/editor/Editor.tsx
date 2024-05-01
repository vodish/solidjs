import { createEffect, createSignal } from "solid-js"
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

export default function Editor({ cssModule = em.editor, children = { ids: [1], rows: [''] } }: TEditorProp) {
  let content!: HTMLDivElement;
  let debug!: HTMLDivElement;
  let max = Math.max.apply(null, children.ids);
  let ids = children.ids;
  let line = 0;
  let lineWas = 0;
  let lines = 0;
  let linesWas = 0;
  let ancorOffset = 0;
  let startNode: HTMLElement | Node = document.body;
  let startOffset = -1;

  const [_ids, setIds] = createSignal(ids)
  const [_line, setLine] = createSignal(line) // номер строки
  const [_lineWas, setLineWas] = createSignal(lineWas) // номер строки был
  const [_lines, setLines] = createSignal(lines) // количество строк
  const [_linesWas, setLinesWas] = createSignal(linesWas) // количество строк было
  const [_anchorOffset, setAnchorOffset] = createSignal(ancorOffset)
  const [_startNode, setStartNode] = createSignal(startNode)
  const [_startOffset, setStartOffset] = createSignal(-1)



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
      deleteRow(e.code)
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

    // всего строк
    setLinesWas(linesWas = lines);
    setLines(lines = content.textContent?.split("\n").length || 0)

    // создать диапозон для определения номера строки
    const range = new Range();
    range.setStartBefore(content.firstChild as Node); // от начала документа
    range.setEnd(sel.anchorNode, sel.anchorOffset); // до позиции курсора

    sel.addRange(range); // применить диапозон
    const textBefore = range.cloneContents().textContent; // скопировать текст диапозона
    const lineNum = textBefore?.split("\n").length || 0;

    setLineWas(lineWas = lineWas === 0 ? lineNum : line)
    setLine(line = lineNum)
  }

  function searchStart(node: Node, offset: number = -1) {
    const content = node.textContent || '';
    setStartOffset(startOffset = -1);

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
    debug.innerHTML = '';
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
      debug.appendChild(div)
    });
  }

  function insertRow() {
    let one = ids.slice(0, lineWas)
    let three = ids.slice(lineWas)
    let two: number[] = []
    for (let i = line - lineWas; i > 0; i--) {
      two.push(++max);
    }
    setIds(ids = [...one, ...two, ...three]);
  }

  function deleteRow(keyCode: string) {
    if (lines >= linesWas) return;

    let from = line;
    from = keyCode==='Delete' && line !== lineWas ? line - 1: from;
    ids.splice(from, linesWas - lines);
    
    setIds(ids = [...ids]);
  }

  return (
    <div class={cssModule}>
      <div css-ids>{_ids().join("\n")}</div>
      <div ref={content} css-editor contenteditable="plaintext-only" onPaste={paste} onInput={input} onKeyUp={keyup} onFocus={focus} onClick={click} >{children.rows.join("\n")}</div>
      <div css-tth>
        <div>lines: {_lines()} ({_linesWas()})</div>
        <div>line: {_line()} ({_lineWas()})</div>
        <div>anchorOffset:{_anchorOffset()}</div>
        <div>startNode:{_startNode().nodeName}</div>
        <div>startOffset:{_startOffset()}</div>
      </div>
      <div ref={debug} css-debugt />
    </div>
  )
}

