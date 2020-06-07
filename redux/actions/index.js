import { USER_LOGIN, USER_SIGNUP, USER_LOCATION, USER_STATUS } from "./types";

export const doLogin = (payload) => {
	return {
		type: USER_LOGIN,
		payload,
	};
};

export const doSignup = (payload) => {
	return {
		type: USER_SIGNUP,
		payload,
	};
};

export const updateUserLocation = (payload) => {
	return {
		type: USER_LOCATION,
		payload,
	};
};

export const fetchStatus = (payload) => {
	return {
		type: USER_STATUS,
		payload,
	};
};
