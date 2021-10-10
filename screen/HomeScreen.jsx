import React, { useEffect } from "react";
import { Image, SafeAreaView, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "@comp/Nav/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_KEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "@lib/slices/NavSlice";
import NavFavorite from "@comp/Nav/NavFavorite";
import { getItemAsync } from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { getCurrentHMDecimalFormat } from "@lib/helper";

const HomeScreen = () => {
  const dispatch = useDispatch();
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
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5 pr-0`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://links.papareact.com/gzs",
          }}
        />
        <GooglePlacesAutocomplete
          placeholder="Where from?"
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          query={{
            key: GOOGLE_KEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
          returnKeyType={"search"}
          fetchDetails={true}
          minLength={2}
        />
        <NavOptions />
        <NavFavorite />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
