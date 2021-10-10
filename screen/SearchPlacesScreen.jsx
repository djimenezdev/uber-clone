import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { GOOGLE_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import { Icon } from "react-native-elements";

const SearchPlaces = () => {
  const navigation = useNavigation();
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    navigation?.setOptions({
      // headerBackTitleVisible: false,
      header: () => (
        <View
          style={[tw`relative z-10 border-b border-gray-200`, { height: 87 }]}
        >
          <TouchableOpacity
            style={tw`absolute bottom-2 left-3`}
            onPress={() => navigation?.goBack()}
          >
            <Icon name="arrow-back" type="material-community-icons" size={30} />
          </TouchableOpacity>

          <GooglePlacesAutocomplete
            ref={inputRef}
            placeholder="Enter an Address"
            query={{
              key: GOOGLE_KEY,
              language: "en",
            }}
            styles={{
              container: [tw`w-full`],
              textInput: [
                tw`relative top-7 bg-gray-200 mr-6 ml-12 mt-3`,
                { height: 40 },
              ],
              listView: [tw`absolute z-40`, { top: 90 }],
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              //  store selected destination in destination stat
              navigation?.replace("AddPlaceScreen", {
                location: details.geometry.location,
                description: data.description,
              });
            }}
            returnKeyType={"search"}
            fetchDetails={true}
            minLength={2}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    let timeout;
    if (inputRef) {
      timeout = setTimeout(() => {
        inputRef?.current?.focus();
        clearTimeout(timeout);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, []);

  return <View style={tw`relative z-10 h-full bg-white`} />;
};

export default SearchPlaces;
