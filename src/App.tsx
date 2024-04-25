import { For, Match, Switch, createSignal, createEffect } from 'solid-js';
import cm from './App.module.css';
import em from './Editor.module.css';
import { setStore1, store1 } from './store/store';
import { ingredients, ingredientsResource } from './store/ingrediens';
import Editor from './components/editor/Editor';






function App() {

  // ingredientsResource()

  // const ingredientsRequest = ingredientsResource()
  // console.log(ingredientsRequest.state)

  const ttt1 = {ids: [0, 2, 3, 4], rows: ["111", "222", "", "444"]};
  

  return <>
    <div class={cm.App}>

      <h3>Editor</h3>

      
      <Editor cm={em.editor} children={ttt1} />
      
      <br />
      <br />
      <br />

      <h3>Количество ингредиентов: {ingredients.length}</h3>
      
      <For each={ingredients}>
        {(item, i) => {
          if ( i() > 3 )  return;
          return <p>{item.name}</p>
        }}
      </For>

      <h3>Количество пользователей: {store1.userCount}</h3>
      
      <button onClick={()=> setStore1("users", store1.users.length, store1.users[0])}>Добавить</button>
      <button >Удалить</button>

      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>

    </div>


    {/* <div style={{"text-align": "center", "margin-top": "2em"}}>
      <img src="https://code.s3.yandex.net/react/code/bun-01-large.png" alt="bun-01" />
    </div> */}
  </>
}

export default App;
