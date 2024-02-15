import { For, Match, Show, Switch, createEffect } from 'solid-js';
import styles from './App.module.css';
import { store1 } from './store/store';
import { ingredients, ingredientsResource } from './store/ingredienResource';




function App() {

  ingredientsResource()

  // const ingredientsRequest = ingredientsResource()
  // console.log(ingredientsRequest.state)


  return <>
    <div class={styles.App}>
      
      <h3>Количество ингредиентов: {ingredients.length}</h3>
      
      <For each={ingredients}>
        {item => <p>{item.name}</p>}
      </For>



      <h3>Количество пользователей: {store1.userCount}</h3>
      
      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>

    </div>


    <div style={{"text-align": "center", "margin-top": "2em"}}>
      <img src="https://code.s3.yandex.net/react/code/bun-01-large.png" alt="bun-01" />
    </div>
  </>
}

export default App;
