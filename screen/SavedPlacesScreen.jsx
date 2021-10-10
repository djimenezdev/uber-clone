import { db } from "@lib/firebase";
import {
  selectLoginInfo,
  selectSavedPlaces,
  setDestination,
  setOrigin,
  setSavedPlaces,
} from "@lib/slices/NavSlice";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { getItemAsync } from "expo-secure-store";
import { getCurrentHMDecimalFormat } from "@lib/helper";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { GOOGLE_KEY } from "@env";

const SavedPlacesScreen = () => {
  const getLoginInfo = useSelector(selectLoginInfo);
  const getSavedPlaces = useSelector(selectSavedPlaces);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTime = async () => {
      const time = await getItemAsync("time_expire");

      if (parseFloat(getCurrentHMDecimalFormat()) - parseFloat(time) === 1) {
        navigation.replace("LoginScreen");
      }
    };
    getTime();
  }, []);

  useEffect(() => {
    const getPlaces = async () => {
      const getPlacesV = await db
        ?.collection("places")
        ?.doc(`${getLoginInfo?.login?.email}`)
        ?.collection("saved")
        ?.get();
      if (getPlacesV?.docs.length === 0) {
        return;
      } else {
        const places = getPlacesV?.docs?.map((doc) => doc.data());
        dispatch(
          setSavedPlaces({
            places: [
              ...places,
              {
                name: "Add Saved Place",
                desc: "Get to your favorite destination faster",
                loc: {
                  lat: "none",
                  lng: "none",
                },
              },
            ],
          })
        );
      }
    };
    getPlaces();
  }, []);

  const setDirectionsFunc = async (desc, lat, lng) => {
    // display loading screen
    setLoading(true);
    // remove header while loading
    navigation?.setOptions({ headerShown: false });
    // get permission for accessing current location
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Cannot set up directions! Go to the apps settings and change location settings to always"
      );
      return;
    }
    // below will run if status is success
    const location = await getCurrentPositionAsync();
    const {
      coords: { latitude, longitude },
    } = location;
    // will  take the coordinates and reverse geocode them into address for the origin desc
    const getAddress = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`
    ).then((res) => res.json());

    // now will store current position coordinates in origin
    dispatch(
      setOrigin({
        location: { lat: latitude, lng: longitude },
        description: getAddress?.results[0]?.formatted_address,
      })
    );

    //  now set destination aka saved place
    dispatch(
      setDestination({
        location: { lat, lng },
        description: desc,
      })
    );

    // and now redirect to map page to see final results
    navigation?.replace("MapScreen", { screen: "RideOptionsCard" });
  };

  return (
    <SafeAreaView
      style={tw`flex-1 ${
        loading ? "bg-black items-center justify-center" : " bg-white"
      }`}
    >
      {loading === true && (
        <>
          <Image
            source={require("../assets/images/uber-clone-logo.png")}
            style={{
              width: 150,
              height: 150,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Setting up the directions for you...
          </Text>
        </>
      )}
      {getSavedPlaces?.length > 0 && loading === false && (
        <FlatList
          data={getSavedPlaces}
          keyExtractor={({ desc }) => desc}
          renderItem={({
            item: {
              name,
              desc,
              loc: { lat, lng },
            },
          }) => {
            if (desc !== "Get to your favorite destination faster") {
              return (
                <TouchableOpacity
                  style={tw`flex-row items-center p-3 border-b border-gray-200`}
                  onPress={() => {
                    setDirectionsFunc(desc, lat, lng);
                  }}
                >
                  <Icon
                    name="star"
                    type="material-community-icons"
                    containerStyle={tw`bg-gray-400 p-1 rounded-full mr-2`}
                    iconStyle={tw`text-white`}
                    size={25}
                  />
                  <View>
                    <Text style={tw`mb-1 font-bold`}>{name}</Text>
                    <Text style={tw`text-gray-400`}>{desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                style={tw`flex-row justify-between items-center p-3 border-b border-gray-200`}
                onPress={() => navigation.navigate("SearchPlacesScreen")}
              >
                <View>
                  <Text style={tw`mb-1 text-blue-700`}>{name}</Text>
                  <Text style={tw`text-gray-400`}>{desc}</Text>
                </View>
                <Icon
                  name="chevron-right"
                  type="material-community-icons"
                  iconStyle={tw`text-gray-400`}
                  size={30}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedPlacesScreen;
