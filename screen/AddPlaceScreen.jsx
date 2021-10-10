import { db } from "@lib/firebase";
import {
  selectLoginInfo,
  selectSavedPlaces,
  setSavedPlaces,
} from "@lib/slices/NavSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";

const AddPlaceScreen = () => {
  const [text, setText] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { location, description } = route.params;
  const inputRef = useRef();
  const getLoginInfo = useSelector(selectLoginInfo);
  const getSavedPlaces = useSelector(selectSavedPlaces);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation?.setOptions({
      header: () => (
        <SafeAreaView style={tw`bg-black items-start`}>
          <View style={tw`ml-8 items-start`}>
            <Icon
              name="close"
              type="material-icons"
              size={24}
              color="#fff"
              containerStyle={tw`m-0 mb-3 p-0`}
              onPress={() => navigation.replace("SavedPlacesScreen")}
            />
            <Text style={[tw`text-white mb-3`, { fontSize: 30 }]}>
              Save Place
            </Text>
          </View>
        </SafeAreaView>
      ),
    });
  }, []);

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus();
    }
  }, []);

  const storePlace = () => {
    db.collection("places")
      .doc(`${getLoginInfo?.login?.email}`)
      .collection("saved")
      .add({
        name: text,
        loc: location,
        desc: description,
      })
      .then(async () => {
        const getPlacesV = await db
          ?.collection("places")
          ?.doc(`${getLoginInfo?.login?.email}`)
          ?.collection("saved")
          ?.get();
        dispatch(
          setSavedPlaces({
            places: [
              ...getPlacesV?.docs.map((doc) => doc.data()),
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
        navigation?.replace("SavedPlacesScreen");
      });
  };

  return (
    <View style={tw`h-1/2  justify-between`}>
      <View style={tw`bg-white`}>
        <View style={[tw`border-b border-gray-300`, { height: 70 }]}>
          <Text style={tw`relative left-2 mt-2 text-gray-500`}>Name</Text>
          <Input
            ref={inputRef}
            placeholder="e.g. Ryan's Home"
            rightIcon={
              <Icon
                name="close"
                type="fontisto"
                size={15}
                color="gray"
                onPress={() => setText("")}
              />
            }
            containerStyle={tw`relative bottom-2`}
            inputContainerStyle={tw`border-b-0`}
            inputStyle={{ fontSize: 15 }}
            value={text}
            onChangeText={(text) => setText(text)}
            onBlur={() => inputRef?.current?.focus()}
          />
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center justify-between border-b border-gray-300 pb-3`}
          onPress={() => navigation.navigate("SearchPlacesScreen")}
        >
          <View>
            <Text style={tw`relative left-2 mt-2 text-gray-500`}>Address</Text>
            <Text style={[tw`mx-3 mt-2  text-black`, { fontSize: 15 }]}>
              {description}
            </Text>
          </View>
          <Icon
            name="chevron-right"
            size={28}
            color="gray"
            containerStyle={tw`mr-1`}
          />
        </TouchableOpacity>
      </View>
      <View style={tw`border-t border-gray-300 p-3`}>
        <Button
          title="Save Place"
          buttonStyle={tw`bg-black p-3`}
          disabled={text.length === 0}
          onPress={storePlace}
        />
      </View>
    </View>
  );
};

export default AddPlaceScreen;
