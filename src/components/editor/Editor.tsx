import { For, createSignal } from "solid-js"
import em from '../../Editor.module.css';


type TEditorProp = {
  cssModule?: CSSModuleClasses[string],
  source?: { id: number, str: string, offset?: number }[],
}

export default function Editor({ cssModule = em.editor, source = [{ id: 1, str: '' }] }: TEditorProp) {
  let ta!: HTMLTextAreaElement
  let content!: HTMLDivElement
  let debug!: HTMLDivElement
  let max = 0
  let offsetRow = 0 // для offset строки
  let text = '';
  let count = source.length - 1;
  let countWas = 0;

  source = source.map((el, key) => {
    max = el.id > max ? el.id : max;
    text += (!key ? '' : '\n') + el.str;
    return {
      ...el,
      offest: key === 0 ? 0 : (offsetRow += source[key - 1].str.length + 1)
    }
  })


  const [_source, setSource] = createSignal(source) // отображение строк
  const [_count0, setCount0] = createSignal(count) // количество строк было
  const [_count, setCount] = createSignal(count) // количество строк сейчас



  let addRow = 0;
  let sel = document.getSelection();
  let line = 0;
  let lineWas = 0;
  let ancorOffset = 0;
  let startNode: HTMLElement | Node = document.body;
  

  const [_ids, setIds] = createSignal([])
  const [_line, setLine] = createSignal(line) // номер строки
  const [_lineWas, setLineWas] = createSignal(lineWas) // номер строки был

  const [_countWas, setCountWas] = createSignal(countWas) // количество строк было
  const [_sel, setSel] = createSignal(sel) // количество строк было
  const [_anchorOffset, setAnchorOffset] = createSignal(ancorOffset)
  const [_startNode, setStartNode] = createSignal(startNode)
  const [_startOffset, setStartOffset] = createSignal(-1)



  function click() {
    getPosition()
  }


  function keyup(e: KeyboardEvent) {
    // добавить строки
    insertRow()

    // получить позицию
    getPosition()



    // if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'NumpadEnter', 'Delete', 'Backspace', 'KeyZ'].includes(e.code)) { }



    if (['Delete', 'Backspace'].includes(e.code)) {
      deleteRow(e.code)
    }


    if (e.code === 'Tab' && !e.shiftKey) {      // добавить пробелы к строкам или emmet
    }
    else if (e.code === 'Tab' && e.shiftKey) {      // удалить пробелы у строк
    }

  }

  function cut(e: ClipboardEvent) {
    // console.log(e)
  }

  function paste(e: ClipboardEvent) {

  }

  function focus() {
    getPosition()
  }




  function getPosition() {
    const sel = document.getSelection()
    if (!sel || !sel.anchorNode) return;

    // заменить BR на \n в последней строке
    if (content.lastChild?.nodeName === 'BR') {
      content.removeChild(content.lastChild)
      content.appendChild(document.createTextNode('\n'))
    }


    // вычислить начало строки: узел и позицию
    searchStart(sel.anchorNode, sel.anchorOffset);


    // установить смещение для отрисовки в дебаге
    // отрисовать дерево узлов в дебаге
    setAnchorOffset(sel.anchorOffset)
    debugTree();


    // проверить наличие выделения мышкой
    // console.log(sel.isCollapsed)


    // всего строк
    setCountWas(countWas = count);
    setCount(count = content.textContent?.replace(/\n$/, '').split("\n").length || 1)


    // создать диапозон для определения номера строки
    const range = new Range();
    range.setStartBefore(content); // от начала документа
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
    if (addRow < 1) return;


    // document.execCommand('insertHTML', false, '\n'.repeat(addRow));
    // addRow = 0;


    // let one = ids.slice(0, lineWas)
    // let three = ids.slice(lineWas)
    // let two: number[] = []
    // for (let i = line - lineWas; i > 0; i--) {
    //   two.push(++max);
    // }
    // setIds(ids = [...one, ...two, ...three]);
  }


  function deleteRow(keyCode: string) {
    // if (count >= countWas) return;

    // let from = (keyCode === 'Delete' && line !== lineWas) ? line - 1 : line;
    // let limit = countWas - count;
    // ids.splice(from, limit);

    // setIds(ids = [...ids]);
  }


  function taInput() { //e: InputEvent
    ta.style.height = 'auto';
    ta.style.height = (ta.scrollHeight) + 'px';
  }

  function taKeyDown(e: KeyboardEvent) {
    if (e.code === 'Tab') {
      e.preventDefault()
    }
  }

  function taPosition() {
    // setCountWas(countWas = count)
    // setCount(count = source.length)
  }

  function taKeyUp(e: KeyboardEvent) {

    taPosition();

    if (e.code === 'Tab' && !e.altKey && !e.ctrlKey) {      // добавить пробелы к строкам или emmet
      e.preventDefault()
      ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end')

      // !e.shiftKey
    }
  }

  return (
    <div class={cssModule}>
      <div css-ta css-view>
        <For each={_source()}>{el =>
          <div>
            <div css-id>{el.id}</div>
            <div css-str>{el.str}</div>
          </div>
        }</For>
      </div>

      <textarea ref={ta} css-ta onInput={taInput} onKeyDown={taKeyDown} onKeyUp={taKeyUp}>{text}</textarea>
      
      <div css-tth>
        <div>count: ({_count0()}) {_count()}</div>
        <div>line: {_line()} ({_lineWas()})</div>
        <div>offset: ? (?)</div>
      </div>
    </div>
  )
}

