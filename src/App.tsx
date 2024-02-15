import { For, Match, Show, Switch, createEffect, createResource } from 'solid-js';
import styles from './App.module.css';
import { store1, setStore1 } from './store/store';


export type TIngredient = {
  _id:            string
  name:           string
  type:           string
  proteins?:      number
  fat?:           number
  carbohydrates?: number
  calories?:      number
  price:          number
  image:          string
  image_mobile:   string
  image_large:    string
  __v?:           number
  uuid?:          number
  count?:         number
}


type TIngredietsFetch = {
  data: TIngredient[]
  susses: boolean
}



async function fetchIngredients() {
  const res = await fetch('https://norma.nomoreparties.space/api/ingredients')
  return res.json()
}


function App() {

  const [ ingredients ] = createResource<TIngredietsFetch>(fetchIngredients)

  createEffect(()=> {
    if ( ingredients.state != 'ready' ) return;
    console.log( ingredients()?.data )
  })

  return <>
    <div class={styles.App}>

      <h3>Запрос на сервер</h3>

      <Switch>
        <Match when={ingredients.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={ingredients()}>
          <p>{JSON.stringify(ingredients()?.data.length)}</p>
        </Match>
      </Switch>

      <h3>Количество пользователей: {store1.userCount}</h3>
      
      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>

    </div>
    <div style={{"text-align": "center"}}>
      <img src="https://code.s3.yandex.net/react/code/bun-01-large.png" alt="bun-01" />
    </div>
  </>
}

export default App;
