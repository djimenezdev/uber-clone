import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { getItemAsync } from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectLoginInfo, setLoginInfo } from "@lib/slices/NavSlice";

const LoadingScreen = () => {
  const [found, setFound] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const getLoginInfo = useSelector(selectLoginInfo);

  const getKey = async () => {
    const res = await getItemAsync("access_token");
    const loginInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${res}`,
        },
      }
    ).then((res) => res.json());
    if (loginInfo?.email) {
      dispatch(setLoginInfo({ login: loginInfo }));
      setFound(true);
    } else if (loginInfo?.error) {
      setFound(false);
    }
  };

  return (
    <AppLoading
      startAsync={getKey}
      onFinish={() => {
        if (found) {
          navigation.replace("HomeScreen");
        } else {
          navigation.replace("LoginScreen");
        }
      }}
      onError={console.warn}
    />
  );
};

export default LoadingScreen;
