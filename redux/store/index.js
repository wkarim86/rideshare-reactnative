import { userReducer } from "../reducers";
import { createStore, combineReducers } from "redux";
import { initialState } from "../reducers/initialState";
const rootReducer = combineReducers({
	user: userReducer,
});
const store = createStore(rootReducer, initialState);
export default store;
