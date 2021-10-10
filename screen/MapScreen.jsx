import Map from "@comp/Map/Map";
import NavigateCard from "@comp/Map/NavigateCard";
import RideOptionsCard from "@comp/Map/RideOptionsCard";
import { getCurrentHMDecimalFormat } from "@lib/helper";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getItemAsync } from "expo-secure-store";
import React, { useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const MapScreen = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  useEffect(() => {
    const getTime = async () => {
      const time = await getItemAsync("time_expire");

      if (parseFloat(getCurrentHMDecimalFormat()) - parseFloat(time) === 1) {
        navigation.replace("LoginScreen");
      }
    };
    getTime();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <TouchableOpacity
        style={tw`absolute top-16 left-8 bg-gray-100 z-50 p-3 rounded-full shadow-lg`}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Icon name="menu" />
      </TouchableOpacity>

      <View style={tw`h-1/2`}>
        <Map />
      </View>
      <View style={tw`h-1/2`}>
        <Stack.Navigator initialRouteName="NavigateCard">
          <Stack.Screen
            name="NavigateCard"
            component={NavigateCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RideOptionsCard"
            component={RideOptionsCard}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MapScreen;
