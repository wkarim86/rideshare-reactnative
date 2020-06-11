import {
	USER_LOGIN,
	USER_SIGNUP,
	USER_LOCATION,
	USER_STATUS,
	USER_DEVICE_TOKEN,
} from "../actions/types";
import { initialState } from "../reducers/initialState";
const userReducer = (state = initialState.user, action) => {
	switch (action.type) {
		case USER_LOGIN:
			var coords = action.payload.status.location.split(",");
			return {
				...state,
				id: action.payload.id,
				fullName: action.payload.fullName,
				deviceToken: action.payload.deviceToken,
				email: action.payload.email,
				status: action.payload.status.status,
				username: action.payload.username,
				location: {
					latitude: coords[0],
					longitude: coords[1],
				},
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
			var coords = action.payload.location.split(",");
			return {
				...state,
				status: action.payload.status,
				location: {
					latitude: coords[0],
					longitude: coords[1],
				},
			};
		case USER_DEVICE_TOKEN:
			return {
				...state,
				deviceToken: action.payload,
			};

		default:
			return state;
	}
};

export { userReducer };
