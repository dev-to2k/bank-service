import React from "react";
import { StyleSheet, View } from "react-native";

// Component Screen chung
const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Thay đổi màu nền ở đây
  },
});

export default Screen;
