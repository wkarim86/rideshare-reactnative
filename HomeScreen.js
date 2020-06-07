import React, { Component, useLayoutEffect } from "react";
import { StyleSheet, Text, View, AsyncStorage, Alert } from "react-native";
import { Appbar, Button, IconButton, Colors } from "react-native-paper";
import Constants from "expo-constants";
import { API_URL, I_NEED_RIDE, I_CAN_SHARE_RIDE } from "./Constants";
import { fetchStatus } from "./redux/actions";
import * as Location from "expo-location";

import { connect } from "react-redux";

class HomeScreen extends Component {
	componentDidMount() {
		this.props.navigation.setOptions({
			headerRight: () => (
				<IconButton
					icon="exit-to-app"
					color={Colors.white}
					onPress={() => this.logout()}
				/>
			),
			//headerLeft: () => null,
		});

		//get user status and redirect to specific screen
		this.__getUserStatus();
	}

	logout = () => {
		this.props.navigation.replace("Login");
	};

	gotoFindRideScreen = () => {
		//update user status first then navigate to find ride screen
		this.props.navigation.navigate("FindRides");
	};

	__updateStatus = (status, callback) => {
		const { userData } = this.props.user;

		this.__getUserCurrentLocation((location) => {
			console.log("Location", location);
			const { latitude, longitude } = location.coords;

			this.__postUserStatus({
				userId: userData.id,
				status,
				location: `${latitude}, ${longitude}`,
				callback,
			});
		});
	};

	__postUserStatus = ({ userId, status, location, callback }) => {
		const formData = new FormData();
		formData.append("user_id", userId);
		formData.append("status", status);
		formData.append("location", location);

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
					console.log("Response", data);
					callback();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	__getUserCurrentLocation = (callback) => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
			}

			let location = await Location.getCurrentPositionAsync({});
			callback(location);
		})();
	};

	__getUserStatus = () => {
		const { userData } = this.props.user;
		fetch(`${API_URL}user/get/status/${userData.id}`, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					switch (data.status) {
						case 1:
							break;
						case 2:
							break;
						case 3:
							this.props.userStatusFetch(data.status);
							break;
						default:
							break;
					}
				}
			})
			.catch((err) => console.error(err));
	};

	render() {
		const { username } = this.props.user.userData;
		return (
			<View style={styles.container}>
				<Text style={styles.userName}>Hi, {username}</Text>
				<Button
					mode="contained"
					onPress={() =>
						this.__updateStatus(I_NEED_RIDE, () => {
							this.gotoFindRideScreen();
						})
					}
				>
					I need a Ride
				</Button>
				<Button
					mode="outlined"
					style={styles.buttonStyle}
					onPress={() =>
						this.__updateStatus(I_CAN_SHARE_RIDE, () => {
							console.log("Redirect me ");
						})
					}
				>
					I can share a Ride
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: Constants.statusBarHeight,
		padding: 20,
		backgroundColor: "#FFF",
		height: "100%",
	},
	mainContainer: {
		backgroundColor: "#FFF",
		height: "100%",
	},
	inputText: {
		marginTop: 20,
	},
	buttonStyle: {
		marginTop: 20,
	},
	userName: {
		marginBottom: 20,
	},
});

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		userStatusFetch: (payload) => {
			dispatch(fetchStatus(payload));
		},
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
