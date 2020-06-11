import {
	USER_LOGIN,
	USER_SIGNUP,
	USER_LOCATION,
	USER_STATUS,
	USER_DEVICE_TOKEN,
} from "./types";

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

export const updateDeviceToken = (payload) => {
	return { type: USER_DEVICE_TOKEN, payload };
};

export const updateStatusAction = (payload) => {
	return { type: USER_STATUS, payload };
};

export const fetchStatus = (payload) => {
	return {
		type: USER_STATUS,
		payload,
	};
};
