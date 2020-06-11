import React, { Component, Fragment } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
	Paragraph,
	DataTable,
	ActivityIndicator,
	Colors,
} from "react-native-paper";
import Constants from "expo-constants";
import { API_URL } from "./Constants";
import MapView, { Marker } from "react-native-maps";
import { connect } from "react-redux";

class AllRides extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [], isLoading: true };
	}
	componentDidMount() {
		this._findRides();
	}

	render() {
		const { isLoading } = this.state;
		const { latitude, longitude } = this.props.user.location;

		return (
			<View>
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
					<Fragment>
						<View style={StyleSheet.absoluteFillObject}>
							<MapView
								style={styles.mapStyle}
								initialRegion={{
									latitude: parseFloat(latitude),
									longitude: parseFloat(longitude),
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
								}}
							/>
						</View>
						{/* <DataTable>
							{this.state.data.map((value, index) => {
								return (
									<DataTable.Row key={index}>
										<DataTable.Cell>{value.fullName}</DataTable.Cell>
										<DataTable.Cell>{value.location}</DataTable.Cell>
									</DataTable.Row>
								);
							})}
						</DataTable> */}
					</Fragment>
				)}
			</View>
		);
	}

	_findRides = () => {
		fetch(`${API_URL}user/list/allRides`, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ data, isLoading: false });
			});
	};
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
export default connect(mapStateToProps)(AllRides);
