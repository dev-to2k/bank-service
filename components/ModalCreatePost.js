import { Ionicons } from "@expo/vector-icons"; // Import thư viện icon
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import PostForm from "./PostForm";

function ModalCreatePost({ visible, newPost, setNewPost, handleAddPost, setIsModalVisible }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modal}>
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <PostForm newPost={newPost} setNewPost={setNewPost} handleAddPost={handleAddPost} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
});

export default ModalCreatePost;
