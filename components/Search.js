import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { COLOR_PRIMARY } from "../constants";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
});

function Search({ searchText, onSearch, placeholder }) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={COLOR_PRIMARY} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={searchText}
        onChangeText={onSearch}
      />
    </View>
  );
}

export default Search;
