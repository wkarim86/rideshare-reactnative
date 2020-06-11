import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	Alert,
	YellowBox,
	AsyncStorage,
} from "react-native";
import {
	TextInput,
	Button,
	Dialog,
	Portal,
	Paragraph,
	ActivityIndicator,
	Colors,
} from "react-native-paper";
import Constants from "expo-constants";
import { API_URL } from "./Constants";
import {
	doLogin,
	updateUserLocation,
	updateDeviceToken,
} from "./redux/actions";
import { connect } from "react-redux";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

YellowBox.ignoreWarnings(["Require cycle:"]);

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			showDialog: false,
			isLoading: false,
		};
	}

	componentDidMount() {
		this.getDeviceToken()
			.then((token) => {
				console.log("token", token);
				if (token !== null) {
					this.props.updateDeviceToken(token);
				}
			})
			.catch((err) => console.error(err));

		//get user current location
		this.__getUserCurrentLocation((location) => {
			console.log("Location", location);
			this.props.updateLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		});
	}

	getDeviceToken = async () => {
		let token = null;
		if (Constants.isDevice) {
			token = await Notifications.getExpoPushTokenAsync();
		} else {
			return null;
		}
		return token;
	};

	_toggleDialog = () => {
		this.setState({ showDialog: !this.state.showDialog });
	};

	_doLogin = () => {
		const data = this.state;
		const formData = new FormData();
		formData.append("username", data.username);
		formData.append("password", data.password);

		this.setState({ isLoading: true });
		fetch(`${API_URL}user/login`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Response", data);
				this.setState({ isLoading: false });
				if (data.error) {
					Alert.alert("Error", data.error, [
						{
							text: "Ok",
							onPress: this._toggleDialog,
						},
					]);
				} else {
					//storing user data
					AsyncStorage.setItem("isLoggedIn", "true").then(() => {
						this.props.actionLogin(data);
						this.props.navigation.replace("Home");
					});
				}
			})

			.catch((error) => {
				this.setState({ isLoading: false });
				console.error(error);
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

	render() {
		const { isLoading } = this.state;
		return (
			<View style={styles.mainContainer}>
				{isLoading && (
					<ActivityIndicator
						animating={true}
						color={Colors.blue300}
						size="large"
						style={{
							flex: 1,
							alignItems: "center",
						}}
					/>
				)}
				{!isLoading && (
					<View style={styles.container}>
						<TextInput
							label="Username"
							value={this.state.username}
							onChangeText={(text) => this.setState({ username: text })}
							style={styles.inputText}
						/>
						<TextInput
							label="Password"
							value={this.state.password}
							onChangeText={(text) => this.setState({ password: text })}
							style={styles.inputText}
							secureTextEntry={true}
						/>
						<Button
							mode="contained"
							style={styles.inputText}
							onPress={this._doLogin}
						>
							Login
						</Button>

						<Button
							mode="outlined"
							style={styles.inputText}
							onPress={() => {
								this.props.navigation.replace("Signup");
							}}
						>
							Create Account
						</Button>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: Constants.statusBarHeight,
		padding: 20,
		backgroundColor: "#FFF",
	},
	mainContainer: {
		backgroundColor: "#FFF",
		height: "100%",
	},
	inputText: {
		marginTop: 20,
	},
});

const mapDispatchToProps = (dispatch) => {
	return {
		actionLogin: (payload) => {
			dispatch(doLogin(payload));
		},
		updateLocation: (payload) => {
			dispatch(updateUserLocation(payload));
		},
		updateDeviceToken: (payload) => {
			dispatch(updateDeviceToken(payload));
		},
	};
};

export default connect(null, mapDispatchToProps)(LoginScreen);
