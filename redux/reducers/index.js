import {
	USER_LOGIN,
	USER_SIGNUP,
	USER_LOCATION,
	USER_STATUS,
} from "../actions/types";
import { initialState } from "../reducers/initialState";
const userReducer = (state = initialState.user, action) => {
	switch (action.type) {
		case USER_LOGIN:
			return {
				...state,
				userData: action.payload,
			};

		case USER_SIGNUP:
			return {
				...state,
				user: action.payload,
			};
		case USER_LOCATION:
			return {
				...state,
				location: action.payload,
			};
		case USER_STATUS:
			return {
				...state,
				status: action.payload,
			};
		default:
			return state;
	}
};

export { userReducer };
