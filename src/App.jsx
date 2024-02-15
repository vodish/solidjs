import { For } from 'solid-js';
import styles from './App.module.css';
import { store1, setStore1 } from './store/store';



function App() {
  return (
    <div class={styles.App}>

      <h3>Количество пользователей: {store1.userCount}</h3>

      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>
    </div>
  );
}

export default App;
