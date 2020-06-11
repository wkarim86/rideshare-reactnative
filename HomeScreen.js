import React, { Component, Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
	Button,
	IconButton,
	Colors,
	ActivityIndicator,
} from "react-native-paper";
import Constants from "expo-constants";
import { I_CAN_SHARE_RIDE, I_CANNOT_SHARE_RIDE } from "./Constants";
import { fetchStatus, updateStatusAction } from "./redux/actions";
import * as Location from "expo-location";
import { getUserStatus, updateStatus } from "./helper";

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
		getUserStatus({ ...this.props });
	}

	logout = () => {
		this.props.navigation.replace("Login");
	};

	gotoFindRideScreen = () => {
		//update user status first then navigate to find ride screen
		this.props.navigation.navigate("RidePick");
	};

	/*
	__updateStatus = (callback) => {
		const { userData } = this.props.user;
		const { latitude, longitude } = this.props.user.location;

		const formData = new FormData();
		formData.append("user_id", userData.id);
		formData.append("status", 3);
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
					console.log("Response", data);

					callback();
				}
			})
			.catch((error) => {
				console.log(error);
			});
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
	*/

	render() {
		const { username, status } = this.props.user;
		console.log("HomeSCrene", this.props);
		return (
			<Fragment>
				<View style={styles.container}>
					<Text style={styles.userName}>Hi, {username}</Text>
					{parseInt(status) == 3 ||
						(parseInt(status) == 2 && (
							<Button
								mode="contained"
								onPress={() => {
									this.gotoFindRideScreen();
								}}
							>
								I need a Ride
							</Button>
						))}

					<Button
						mode="outlined"
						style={styles.buttonStyle}
						onPress={() =>
							updateStatus({
								status: status == 1 ? I_CANNOT_SHARE_RIDE : I_CAN_SHARE_RIDE,
								...this.props,
								callback: (data) => {
									this.props.updateUserStatus(data);
								},
							})
						}
					>
						{status == 1 ? "I cannot share a ride" : "I can share a ride"}
					</Button>
				</View>
			</Fragment>
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
		updateUserStatus: (payload) => {
			dispatch(updateStatusAction(payload));
		},
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
