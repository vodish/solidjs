import { createStore } from "solid-js/store";
import { TIngredient, TIngredietsFetch } from "../utils/types";
import { createEffect, createResource } from "solid-js";



  
export const [ingredients, setIngredients] = createStore<TIngredient[]>([])


export function ingredientsResource() {

    const [ request ] = createResource<TIngredietsFetch>( async ()=>{
        const res = await fetch('https://norma.nomoreparties.space/api/ingredients')
        return res.json()
    })

    createEffect(()=> {
        // console.log( request.state )
        
        if ( request.state == 'ready' ) {
            setIngredients( request()?.data )
        }
        
    })

    return request
}

