import React, { Component, Fragment } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
	Paragraph,
	ActivityIndicator,
	Colors,
	Button,
	TouchableRipple,
	Text,
} from "react-native-paper";
import Constants from "expo-constants";
import { API_URL, I_NEED_RIDE } from "./Constants";
import MapView, { Marker } from "react-native-maps";
import { connect } from "react-redux";

class LocationPick extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			marker: { latitude: 0.0, longitude: 0.0 },
			isActionButton: false,
		};
	}

	componentDidMount() {
		const { latitude, longitude } = this.props.user.location;
		this.setState({
			isLoading: false,
			marker: {
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
			},
		});
	}

	render() {
		const { isLoading, marker, isActionButton } = this.state;
		const { latitude, longitude } = this.props.user.location;
		console.log("LocationPick", this.props);
		return (
			<Fragment>
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
					<View style={StyleSheet.absoluteFillObject}>
						<MapView
							style={styles.mapStyle}
							initialRegion={{
								latitude: parseFloat(latitude),
								longitude: parseFloat(longitude),
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}}
						>
							<Marker
								coordinate={marker}
								title="Current Location"
								draggable={true}
								onDragStart={() => {
									this.setState({ isActionButton: false });
								}}
								onDragEnd={(e) =>
									this.setState({
										marker: e.nativeEvent.coordinate,
										isActionButton: true,
									})
								}
							></Marker>
						</MapView>
						{isActionButton && (
							<ButtonCallout {...this.state} {...this.props} />
						)}
					</View>
				)}
			</Fragment>
		);
	}
}

const ButtonCallout = ({ marker, user, navigation }) => {
	return (
		<TouchableRipple
			style={styles.callout}
			rippleColor={Colors.blue300}
			onPress={() => {
				const { latitude, longitude } = marker;
				const formData = new FormData();
				formData.append("user_id", user.id);
				formData.append("status", I_NEED_RIDE);
				formData.append("location", `${latitude}, ${longitude}`);

				console.log("FormData", formData);

				fetch(`${API_URL}user/update/status`, {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						console.log("LocationPick", data);
						if (!data) {
							console.log(data);
						} else {
							console.log("i am here");
							navigation.navigate("FindRides");
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}}
		>
			<Text style={{ textAlign: "center", fontSize: 22 }}>
				Confirm this location
			</Text>
		</TouchableRipple>
	);
};

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
	buttonStyle: {
		marginTop: 20,
	},
	mapStyle: {
		alignSelf: "stretch",
		height: Dimensions.get("window").height,
		...StyleSheet.absoluteFillObject,
	},
	callout: {
		padding: 20,
		position: "absolute",
		bottom: 40,
		alignSelf: "center",
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: 60,
		width: Dimensions.get("window").width - 80,
	},
});

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
export default connect(mapStateToProps)(LocationPick);
