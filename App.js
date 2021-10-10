import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@lib/store";
import HomeScreen from "screen/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "screen/MapScreen";
import LoginScreen from "screen/LoginScreen";
import { warmUpAsync, coolDownAsync } from "expo-web-browser";
import LoadingScreen from "screen/LoadingScreen";
import SavedPlacesScreen from "screen/SavedPlacesScreen";
import SearchPlacesScreen from "screen/SearchPlacesScreen";
import AddPlaceScreen from "screen/AddPlaceScreen";
import { Icon } from "react-native-elements";

// init Stack
const Stack = createNativeStackNavigator();

export default function App() {
  // preps webbrowser in background making login more enjoyable
  useEffect(() => {
    // preps webBrowser
    warmUpAsync();

    return () => {
      // turns it off if component unmounts
      coolDownAsync();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator
            screenOptions={{ orientation: "portrait_up" }}
            initialRouteName="LoadingScreen"
          >
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                title: "Login",
              }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SavedPlacesScreen"
              component={SavedPlacesScreen}
              options={({ navigation }) => ({
                title: "Choose a Place",
                headerLeft: () => (
                  <Icon
                    name="chevron-left"
                    size={25}
                    onPress={() => navigation.replace("HomeScreen")}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="MapScreen"
              component={MapScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SearchPlacesScreen"
              component={SearchPlacesScreen}
            />
            <Stack.Screen name="AddPlaceScreen" component={AddPlaceScreen} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
