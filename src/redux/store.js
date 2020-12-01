import { createStore, combineReducers } from 'redux';

import { reducer } from './reducer';

const allReducers = combineReducers({
    earlyPayment: reducer
});

export const store = createStore(allReducers);

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
