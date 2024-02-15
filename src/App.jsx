import { unwrap } from 'solid-js/store';
import styles from './App.module.css';
import { store1, setStore1 } from './store/store';



function App() {
  return (
    <div class={styles.App}>
      {store1.users[0].username}
    </div>
  );
}

export default App;
