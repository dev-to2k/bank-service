import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_PRIMARY } from "../constants";
import { UserContext } from "../contexts/userContext";

export default function CustomDrawerContent({ navigation }) {
  const { user, handleLogout } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <View style={styles.menuItem}>
          <DrawerItem
            label="Trang Chủ"
            onPress={() => navigation.navigate("Home")}
            style={styles.drawerItem}
            labelStyle={styles.drawerItemLabel}
          />
        </View>
        {!user ? (
          <View style={styles.menuItem}>
            <DrawerItem
              label="Đăng Nhập"
              onPress={() => navigation.navigate("SignIn")}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
              label="Đăng Ký"
              onPress={() => navigation.navigate("SignUp")}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
          </View>
        ) : (
          <View style={styles.menuItem}>
            <DrawerItem
              label="Dashboard"
              onPress={() => navigation.navigate("Dashboard")}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
              label="Quản Lý Bài Viết"
              onPress={() => navigation.navigate("PostManagement")}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
              label="Bài Viết Đã Lưu"
              onPress={() => navigation.navigate("SavedPosts")}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
          </View>
        )}
      </DrawerContentScrollView>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Xin chào: {user.email}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
            <Text style={styles.buttonText}>Thoát</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuItem: {
    // marginBottom: 20,
  },
  drawerItem: {
    // Custom styles for drawer item if needed
  },
  drawerItemLabel: {
    // Custom styles for drawer item label if needed
  },
  userInfoContainer: {
    marginTop: "auto",
    padding: 16,
  },
  userInfoText: {
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
