import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLOR_PRIMARY } from "../constants";

const ModalUpdatePost = ({ visible, post, setIsModalUpdateVisible, onUpdate }) => {
  const [updatedPost, setUpdatedPost] = useState(post);

  useEffect(() => {
    setUpdatedPost(post);
  }, [post]);

  const handleUpdatePost = () => {
    onUpdate(updatedPost);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        {post && (
          <>
            <Text style={styles.modalTitle}>{post?.title}</Text>
            <Text style={styles.modalLabel}>Tiêu đề:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedPost?.title}
              onChangeText={(text) => setUpdatedPost({ ...updatedPost, title: text })}
            />
            <Text style={styles.modalLabel}>Mô tả:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedPost?.description}
              onChangeText={(text) => setUpdatedPost({ ...updatedPost, description: text })}
            />
            <Text style={styles.modalLabel}>Hình ảnh:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedPost?.image}
              onChangeText={(text) => setUpdatedPost({ ...updatedPost, image: text })}
            />
            <Text style={[styles.modalLabel]}>Nội dung:</Text>
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              multiline
              numberOfLines={6}
              value={updatedPost?.content}
              onChangeText={(text) => setUpdatedPost({ ...updatedPost, content: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsModalUpdateVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonUpdate]}
                onPress={handleUpdatePost}
              >
                <Text style={styles.modalButtonText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 8,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "gray",
  },
  modalButtonUpdate: {
    backgroundColor: COLOR_PRIMARY,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalUpdatePost;
