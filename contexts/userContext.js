import { useNavigation } from "@react-navigation/native";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import authApi from "../services/auth";

WebBrowser.maybeCompleteAuthSession();

const FACEBOOK_ID = "745945153932673";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [requestFB, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
    clientId: FACEBOOK_ID,
  });

  const [requestGG, responseGG, promptAsyncGG] = Google.useAuthRequest({
    webClientId: "52091072538-3g6sc27lmk0qpf6qqi4nbsfmrusn93fu.apps.googleusercontent.com",
    androidClientId: "52091072538-qkn540sap0tphg94ar3fq0hghtuekjkf.apps.googleusercontent.com",
  });

  const getUserInfoGG = async (accessToken) => {
    if (!accessToken) return;

    try {
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      const userInfo = await userInfoResponse.json();
      setUser(userInfo);
    } catch (error) {
      setError(error.message);
    }
  };

  const getUserInfoFB = async (accessToken) => {
    if (!accessToken) return;

    try {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
      );
      const userInfo = await userInfoResponse.json();
      setUser(userInfo);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (responseFB && responseFB.type === "success" && responseFB.authentication) {
      getUserInfoFB(responseFB?.authentication?.accessToken);
    }
  }, [responseFB]);

  useEffect(() => {
    if (responseGG && responseGG.type === "success" && responseGG.authentication) {
      getUserInfoGG(responseGG?.authentication?.accessToken);
    }
  }, [responseGG]);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      const loggedInUser = await authApi.login(username, password);

      if (loggedInUser instanceof Error) {
        setError(loggedInUser.message);
        return;
      } else {
        setUser(loggedInUser);
        navigation.navigate("Home");
        Alert.alert("Đăng nhập", "Đăng nhập thành công!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFacebook = async () => {
    try {
      setLoading(true);
      const result = await promptAsyncFB();

      if (result.type !== "success") {
        alert("Uh oh, something went wrong");
        return;
      }

      navigation.navigate("Home");
      Alert.alert("Đăng nhập", "Đăng nhập thành công!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);

      const result = await promptAsyncGG();

      if (result.type !== "success") {
        alert("Uh oh, something went wrong");
        return;
      }

      Alert.alert("Đăng nhập", "Đăng nhập thành công!");
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      setError(null);
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      setLoading(true);
      const newUser = await authApi.register(username, password);

      if (newUser instanceof Error) {
        setError(newUser.message);
        return;
      } else {
        setUser(newUser);
        Alert.alert("Đăng ký", "Đăng ký thành công!");
        navigation.navigate("Home");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      setLoading(true);
      const currentUser = await authApi.getCurrentUser();

      if (currentUser instanceof Error) {
        setError(currentUser.message);
        return;
      } else {
        setUser(currentUser);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleRegister,
        getCurrentUserInfo,
        handleLoginFacebook,
        handleLoginGoogle,
        loading,
        error,
        requestFB,
        requestGG,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
