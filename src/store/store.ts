import { createEffect, createRoot } from "solid-js"
import { createStore } from "solid-js/store"


export const [store1, setStore1] = createStore({
  userCount: 3,
  users: [
    {
      id: 0,
      username: "Петя",
      location: "England",
      loggedIn: false,
    },
    {
      id: 1,
      username: "Коля",
      location: "Canada",
      loggedIn: true,
    },
    {
      id: 1,
      username: "Маша",
      location: "India",
      loggedIn: true,
    },
  ],
})

createRoot(() => {
  createEffect(() => {
    setStore1("userCount", store1.users.length)
  })
})

