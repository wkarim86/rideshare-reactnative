import React, { useState, Fragment } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AsyncStorage } from "react-native";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import AllRides from "./AllRides";
import LocationPick from "./LocationPick";
const Stack = createStackNavigator();

export default function Main() {
	const [isLoggedIn, setIsLoggedIn] = useState("");
	React.useEffect(() => {
		checkLogin().then((data) => {
			setIsLoggedIn(data);
		});
	});
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={isLoggedIn === "true" ? "Home" : "Login"}
				screenOptions={{
					headerStyle: {
						backgroundColor: "#007acc",
					},
					headerTintColor: "#FFF",
				}}
			>
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{
						title: "Login",
					}}
				/>

				<Stack.Screen
					name="Signup"
					component={SignupScreen}
					options={{
						title: "Sign Up",
					}}
				/>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{
						title: "RideShare",
					}}
				/>
				<Stack.Screen
					name="FindRides"
					component={AllRides}
					options={{
						title: "Find Ride",
					}}
				/>
				<Stack.Screen
					name="RidePick"
					component={LocationPick}
					options={{
						title: "Where to go?",
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export const checkLogin = () => {
	const isLoggedIn = AsyncStorage.getItem("isLoggedIn");
	return isLoggedIn;
};
