import { createStore } from "solid-js/store" 


export const [store1, setStore1] = createStore({
    userCount: 3,
    users: [
        {
        id: 0,
        username: "felix909",
        location: "England",
        loggedIn: false,
        },
        {
        id: 1,
        username: "tracy634",
        location: "Canada",
        loggedIn: true,
        },
        {
        id: 1,
        username: "johny123",
        location: "India",
        loggedIn: true,
        },
    ],
})