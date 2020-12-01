import { ADD_EARLY, DELETE_EARLY, UPDATE_EARLY } from "./actions";
import { earlyPayment } from "./states";

export let reducer = (state = earlyPayment, action) => {
    let newTodos;
    switch (action.type) {
        case ADD_EARLY:
            newTodos = [...state];
            newTodos.push(action.payload);
            return newTodos;
        case UPDATE_EARLY:
            newTodos = [...state];
            let index = -1;
            for (let i = 0; i < newTodos.length; i++) {
                index++;
                if (newTodos[i].id === action.payload.id) {
                    break;
                }
            }
            if (index !== -1) {
                newTodos[index] = action.payload;
                return newTodos;
            }
            break;
        case DELETE_EARLY:
            newTodos = [...state];
            newTodos = newTodos.filter(todo => todo.id !== action.payload);
            return newTodos;
    }
    return state;
}
