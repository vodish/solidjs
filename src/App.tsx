import { For, Match, Switch, createSignal, createEffect } from 'solid-js';
import cm from './App.module.css';
import { store1, setStore1 } from './store/store';
import { ingredients, ingredientsResource } from './store/ingrediens';
import Editor from './components/editor/Editor';
import { produce } from 'solid-js/store';






function App() {

  // ingredientsResource()

  // const ingredientsRequest = ingredientsResource()
  // console.log(ingredientsRequest.state)
  const ttt1 = { ids: [1, 2, 3, 4], rows: ["123", "222", "", "444"] };



  // function userCreate() {
  //   setStore1('users', newArr => [newArr[newArr.length-1], ...newArr])
  // }
  function userCreate() {
    setStore1('users', produce(newArr => {
      newArr.unshift(newArr[0])
      return newArr;
    }))
  }

  function userDelete() {
    setStore1("users", produce(newArr => newArr.splice(-1, 1)))
  }


  return <>
    <div class={cm.App}>
      <div style={{ width: "1024px", margin: "0 auto" }}>
        <Editor children={ttt1} />
      </div>
      {/* <h3>Количество пользователей: {store1.userCount}</h3>

      <button onClick={userCreate}>Добавить</button>
      <button onClick={userDelete}>Удалить</button>

      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For> */}

    </div>

  </>
}

export default App;




{/* <h3>Количество ингредиентов: {ingredients.length}</h3>
<For each={ingredients}>
  {(item, i) => {
    if (i() > 3) return;
    return <p>{item.name}</p>
  }}
</For> */}

