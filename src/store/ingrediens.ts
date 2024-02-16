import { createStore } from "solid-js/store";
import { TIngredient, TIngredietsFetch } from "../utils/types";
import { createEffect, createResource } from "solid-js";


export const [ingredients, setIngredients]  =   createStore<TIngredient[]>([])


// ресурс без параметров

export function ingredientsResource() {

    const [ request ] = createResource<TIngredietsFetch>(
        async ()=>{
        const res = await fetch('https://norma.nomoreparties.space/api/ingredients')
        return res.json()
        }
    )

    createEffect(()=> {
        // console.log( request.state )
        if ( request.state == 'ready' ) {
            setIngredients( request()?.data )
        }
    })

    return request;
}



// ресурс с параметрами

export function ingredientsResourceParam() {


    async function requestFetch(userId: number) {
        console.log(userId)
        const res = await fetch('https://norma.nomoreparties.space/api/ingredients')
        return res.json()
    }


    const v1 = 12344444;
    const [ request ] = createResource<TIngredietsFetch, number>(v1, requestFetch)

    createEffect(()=> {
        // console.log( request.state )
        if ( request.state == 'ready' ) {
            setIngredients( request()?.data )
        }
    })

    return request;
}


