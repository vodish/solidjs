import { For } from 'solid-js';
import styles from './App.module.css';
import { store1, setStore1 } from './store/store';



function App() {


  function addUser() {
    
    setStore1("users", users => [...users, store1.users[0] ])

  }



  return (
    <div class={styles.App}>

      <h3>Количество пользователей: {store1.userCount}</h3>
      <button onClick={addUser}>Добавить</button>

      <hr />
      <For each={store1.users} fallback={<div>Загружаю...</div>}>
        {(item) => <div>{JSON.stringify(item)}</div>}
      </For>

    </div>
  );
}

export default App;
