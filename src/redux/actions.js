export const ADD_EARLY = 'ADD_EARLY';
export const DELETE_EARLY = 'DELETE_EARLY';
export const UPDATE_EARLY = 'UPDATE_EARLY';

export function addEarly(todo) {
    return {
        type: ADD_EARLY,
        payload: todo
    }
}

export function deleteEarly(todoId) {
    return {
        type: DELETE_EARLY,
        payload: todoId
    }
}

export function updateEarly(todo) {
    return {
        type: UPDATE_EARLY,
        payload: todo
    }
}

