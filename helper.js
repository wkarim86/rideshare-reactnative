import { API_URL } from "./Constants";
import { Alert } from "react-native";

/**
 * get user status
 */
export const getUserStatus = ({ user, userStatusFetch }) => {
	const { userData } = user;
	fetch(`${API_URL}user/get/status/${userData.id}`, {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => {
			if (data) {
				switch (parseInt(data.status)) {
					case 1:
						break;
					case 2:
						break;
					case 3:
						userStatusFetch(data.status);
						break;
					default:
						break;
				}
			}
		})
		.catch((err) => console.error(err));
};

/**
 * update user status
 */

export const updateStatus = ({ status, user, callback }) => {
	const { latitude, longitude } = user.location;
	const formData = new FormData();
	formData.append("user_id", user.id);
	formData.append("status", status);
	formData.append("location", `${latitude}, ${longitude}`);

	fetch(`${API_URL}user/update/status`, {
		method: "POST",
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.error) {
				Alert.alert("Error", data.error, [
					{
						text: "Ok",
						onPress: this._toggleDialog,
					},
				]);
			} else {
				callback(data);
			}
		})
		.catch((error) => {
			console.log(error);
		});
};
