import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './userReducer';

const store = createStore(userReducer, applyMiddleware(thunk));

export default store;