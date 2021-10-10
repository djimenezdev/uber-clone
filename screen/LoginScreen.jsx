import { maybeCompleteAuthSession } from "expo-web-browser";
import { useAuthRequest as GoogleAuthReq } from "expo-auth-session/providers/google";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { setItemAsync, WHEN_UNLOCKED } from "expo-secure-store";
import { getCurrentHMDecimalFormat } from "@lib/helper";
import { useDispatch } from "react-redux";
import { setLoginInfo } from "@lib/slices/NavSlice";
// will close modal after auth is completed.
maybeCompleteAuthSession();

const LoginScreen = () => {
  const [req, res, promptAsync] = GoogleAuthReq({
    expoClientId:
      "1091824907944-o9b2nj3cgj1p3ollt5l59rrd6affcucc.apps.googleusercontent.com",
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const createKey = async () => {
    if (res?.type === "success") {
      const { authentication } = res;
      if (res?.type === "success") {
        storeKey(authentication?.accessToken);
        const loginInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${authentication?.accessToken}`,
            },
          }
        ).then((res) => res.json());
        dispatch(setLoginInfo({ login: loginInfo }));
        navigation?.replace("HomeScreen");
      } else {
        alert("Error! Try signing in again.");
      }
    }
  };

  const storeKey = async (value) => {
    if (Platform.OS === "ios") {
      await setItemAsync("access_token", value, {
        keychainAccessible: WHEN_UNLOCKED,
      });
    } else {
      await setItemAsync("access_token", value);
    }
    await setItemAsync("time_expire", getCurrentHMDecimalFormat());
  };

  // if key doesn't exist, user signs in and generates key
  useEffect(() => {
    createKey();
  }, [res]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("/assets/images/uber-clone-logo.png")}
      />
      <Text style={styles.text}>
        This is a clone of uber for educational purposes only! Sign in to check
        it out:&#41;
      </Text>
      <Button
        icon={
          <Icon
            type="font-awesome-5"
            name="google"
            color="#01A7F7"
            style={styles.buttonIcon}
          />
        }
        type="outline"
        title="Sign in with google"
        onPress={() => promptAsync()}
        buttonStyle={styles.buttonContainer}
        style={styles.button}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  text: {
    marginTop: 30,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 17,
    lineHeight: 24,
  },
  buttonContainer: {
    borderWidth: 2,
  },
  button: {
    marginTop: 40,
    width: 300,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
