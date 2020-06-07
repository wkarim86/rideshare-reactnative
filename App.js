import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Main from "./Main";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
	return (
		<Provider store={store}>
			<Main />
		</Provider>
	);
}
