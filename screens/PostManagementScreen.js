import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ModalCreatePost from "../components/ModalCreatePost";
import ModalUpdatePost from "../components/ModalUpdatePost";
import TruncatedText from "../components/TruncatedText";
import { COLOR_PRIMARY } from "../constants";
import postApi from "../services/post";

function PostManagementScreen() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    image: "",
    content: "",
    createdAt: new Date().getTime(),
  });
  const [searchText, setSearchText] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);

  const handleGetAllPosts = async () => {
    try {
      setLoading(true);
      const posts = await postApi.getAllPosts();
      setPosts(posts);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch posts.");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      setLoading(true);
      const createdPost = await postApi.createPost(newPost);
      setPosts((prevPosts) => [...prevPosts, createdPost]);
      setNewPost({
        title: "",
        description: "",
        image: "",
        content: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to create post.");
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      await postApi.deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      Alert.alert("Error", "Failed to delete post.");
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsModalUpdateVisible(true);
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      setLoading(true);
      await postApi.editPost(updatedPost.id, updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    } catch (error) {
      Alert.alert("Error", "Failed to edit post.");
      console.error("Error editing post:", error);
    } finally {
      setLoading(false);
      setIsModalUpdateVisible(false);
      setEditingPost(null);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const renderPosts = () => {
    let filteredPosts = posts;

    if (searchText.trim() !== "") {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filteredPosts.length === 0) {
      return <Text style={styles.noPostsText}>No posts available.</Text>;
    }

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.textHeader}>Quản lý bài viết</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.buttonText}>Tạo bài viết</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.column1]}>STT</Text>
            <Text style={[styles.tableHeaderText, styles.column2]}>Tiêu đề</Text>
            <Text style={[styles.tableHeaderText, styles.column3]}>Hình Ảnh</Text>
            <Text style={[styles.tableHeaderText, styles.column4]}>Nội Dung</Text>
            <Text style={[styles.tableHeaderText, styles.column5]}>Mô tả</Text>
            <Text style={[styles.tableHeaderText, styles.column6]}>Ngày tạo</Text>
            <Text style={[styles.tableHeaderText, styles.column7]}>Chức năng</Text>
          </View>
          {filteredPosts.map((post, index) => (
            <View key={post.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.column1]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.column2]}>{post.title}</Text>
              <Image
                source={{ uri: post.image || "fallback_image_uri" }}
                style={[styles.tableCellImage, styles.column3]}
              />
              <TruncatedText
                text={post.content}
                style={[styles.tableCell, styles.column4]}
                maxLength={100}
              />
              <TruncatedText
                text={post.description}
                style={[styles.tableCell, styles.column5]}
                maxLength={100}
              />
              <Text style={[styles.tableCell, styles.column6]}>
                {moment(post.createdAt).format("DD/MM/YYYY")}
              </Text>
              <View style={[styles.tableCellActions, styles.column7]}>
                <TouchableOpacity onPress={() => handleEditPost(post)}>
                  <Text style={[styles.tableButton, styles.buttonEdit]}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                  <Text style={[styles.tableButton, styles.buttonDelete]}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ModalCreatePost
        visible={isModalVisible}
        newPost={newPost}
        setNewPost={setNewPost}
        handleAddPost={handleAddPost}
        setIsModalVisible={setIsModalVisible}
      />

      <Text style={styles.textHeader}>Tìm kiếm</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm bài viết..."
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>

      {loading ? <Text>Đang tải...</Text> : renderPosts()}

      <ModalUpdatePost
        visible={isModalUpdateVisible}
        post={editingPost}
        setIsModalUpdateVisible={setIsModalUpdateVisible}
        onUpdate={handleUpdatePost}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  tableContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  tableCellImage: {
    width: 50,
    height: 50,
  },
  tableCellActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "#fff",
    borderRadius: 5,
  },
  buttonEdit: {
    backgroundColor: COLOR_PRIMARY,
    marginRight: 8,
  },
  buttonDelete: {
    backgroundColor: "#e84118",
  },
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
  noPostsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#888",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  column1: {
    flex: 0.5, // Chiều rộng cột 1 chiếm 50% không gian ngang
  },
  column2: {
    flex: 1, // Chiều rộng cột 2 chiếm 100% không gian ngang
  },
  column3: {
    flex: 0.5, // Chiều rộng cột 3 chiếm 50% không gian ngang
  },
});

export default PostManagementScreen;
