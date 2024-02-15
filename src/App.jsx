import styles from './App.module.css';
import { store1, setStore1 } from './store/store';



function App() {
  return (
    <div class={styles.App}>
      {store1.userCount}
    </div>
  );
}

export default App;
