import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Rating = ({ rating, onPress }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIcon = i <= rating ? "star" : "star-outline";
      stars.push(
        <TouchableOpacity key={i} onPress={() => onPress(i)}>
          <Ionicons name={starIcon} size={24} color="#FFD700" />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});

export default Rating;
