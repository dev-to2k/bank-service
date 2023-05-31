import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import CustomDrawerContent from "./components/CustomDrawerContent";
import { COLOR_PRIMARY } from "./constants";
import { UserProvider } from "./contexts/userContext";
import AllPostsScreen from "./screens/AllPostsScreen";
import DashboardScreen from "./screens/DashboardScreen";
import HomeScreen from "./screens/HomeScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import PostManagementScreen from "./screens/PostManagementScreen";
import SavedPostsScreen from "./screens/SavedPostsScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: 50,
  },
  logo: {
    width: 100,
    height: 40,
    borderRadius: 4,
    resizeMode: "cover",
    transform: [
      {
        translateX: -70,
      },
    ],
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          useLegacyImplementation
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: COLOR_PRIMARY },
            headerTintColor: "#fff",
            headerTitle: () => (
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("./assets/logo.jpg")} />
              </View>
            ),
            cardStyle: { backgroundColor: "red" }, // Đặt màu nền cho toàn bộ các route ở đây
          }}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="SignIn" component={SignInScreen} />
          <Drawer.Screen name="SignUp" component={SignUpScreen} />
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="PostManagement" component={PostManagementScreen} />
          <Drawer.Screen name="PostDetail" component={PostDetailScreen} />
          <Drawer.Screen name="AllPosts" component={AllPostsScreen} />
          <Drawer.Screen name="SavedPosts" component={SavedPostsScreen} />
        </Drawer.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}
