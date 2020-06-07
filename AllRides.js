import React, { Component, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import {
	Paragraph,
	DataTable,
	ActivityIndicator,
	Colors,
} from "react-native-paper";
import Constants from "expo-constants";
import { API_URL } from "./Constants";
import MapView from "react-native-maps";

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
		return (
			<View style={styles.container}>
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
						<MapView
							initialRegion={{
								latitude: 37.78825,
								longitude: -122.4324,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
							}}
						/>
						<DataTable>
							{this.state.data.map((value, index) => {
								return (
									<DataTable.Row key={index}>
										<DataTable.Cell>{value.fullName}</DataTable.Cell>
										<DataTable.Cell>{value.location}</DataTable.Cell>
									</DataTable.Row>
								);
							})}
						</DataTable>
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
	inputText: {
		marginTop: 20,
	},
	buttonStyle: {
		marginTop: 20,
	},
});

export default AllRides;
