import { navFavoritesData } from "@constants/navData";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const NavFavorite = () => {
  const navigation = useNavigation();

  return (
    /* <FlatList
      data={navFavoritesData}
      scrollEnabled={false}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { icon, location, destination } }) => ( */
    <View>
      <TouchableOpacity
        style={tw`flex-row justify-between  pb-5 pt-5 pr-0`}
        onPress={() => navigation.navigate("SavedPlacesScreen")}
      >
        <Icon
          style={tw`mr-4 rounded-full pt-0 pr-3 pb-3 pl-0`}
          name="star"
          type="material-icons"
          color="gray"
          size={30}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`font-semibold text-lg`}>Choose a saved place</Text>
          <View style={[tw`bg-gray-500 `, { height: 0.5, marginTop: 20 }]} />
        </View>
      </TouchableOpacity>
    </View>
    /*   )}
    /> */
  );
};

export default NavFavorite;
