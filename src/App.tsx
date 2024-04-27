import { For, Match, Switch, createSignal, createEffect } from 'solid-js';
import cm from './App.module.css';
import { store1, setStore1 } from './store/store';
import { ingredients, ingredientsResource } from './store/ingrediens';
import Editor from './components/editor/Editor';






function App() {
  
  // ingredientsResource()

  // const ingredientsRequest = ingredientsResource()
  // console.log(ingredientsRequest.state)

  const ttt1 = { ids: [0, 2, 3, 4], rows: ["111", "222", "", "444"] };


  return <>
    <div class={cm.App}>

      <h3>Editor</h3>


      <Editor children={ttt1} />

      <br />
      <br />
      <br />

      <h3>Количество ингредиентов: {ingredients.length}</h3>

      <For each={ingredients}>
        {(item, i) => {
          if (i() > 3) return;
          return <p>{item.name}</p>
        }}
      </For>

      <p>
      <span style={{color: 'red'}}>red</span>
      </p>

      <h3>Количество пользователей: {store1.userCount}</h3>

      <button onClick={() => setStore1("users", store1.users.length, store1.users[0])}>Добавить</button>
      <button onClick={() => ('')}>Удалить</button>

      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>

    </div>
    
  </>
}

export default App;
