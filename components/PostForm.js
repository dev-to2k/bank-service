import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLOR_PRIMARY } from "../constants";

function PostForm({ newPost, setNewPost, handleAddPost }) {
  return (
    <View
      style={{
        padding: 16,
      }}
    >
      <Text style={styles.textHeader}>Tạo Bài Viết</Text>
      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={newPost.title}
        onChangeText={(text) => setNewPost({ ...newPost, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={newPost.description}
        onChangeText={(text) => setNewPost({ ...newPost, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Hình ảnh URL"
        value={newPost.image}
        onChangeText={(text) => setNewPost({ ...newPost, image: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nội dung"
        value={newPost.content}
        onChangeText={(text) => setNewPost({ ...newPost, content: text })}
        multiline
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddPost}>
        <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
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
  textHeader: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default PostForm;
