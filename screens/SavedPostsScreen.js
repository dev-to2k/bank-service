import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import postApi from "../services/post";

const SavedPostsScreen = () => {
  const navigation = useNavigation();
  const [savedPosts, setSavedPosts] = useState([]);

  const getSavedPosts = async () => {
    try {
      const newPostsString = await AsyncStorage.getItem("savedPosts");
      return newPostsString != null ? JSON.parse(newPostsString) : [];
    } catch (error) {
      console.log("Error retrieving saved posts:", error);
    }
  };

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const postsString = await getSavedPosts();
        const savedPostPromises = postsString.map((postId) => {
          if (postId) {
            return postApi.getPostById(postId);
          }
        });
        const fetchedPosts = await Promise.all(savedPostPromises);
        setSavedPosts(fetchedPosts || []);
      } catch (error) {
        console.error("Error getting saved posts", error);
      }
    };

    if (!savedPosts.length) {
      fetchSavedPosts();
    }

    return () => {
      setSavedPosts([]);
    };
  }, []);

  const handlePostPress = (postId) => {
    navigation.navigate("PostDetail", { postId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity key={item.id} onPress={() => handlePostPress(item.id)}>
      <View style={styles.postContainer}>
        <Image source={{ uri: item.image || "fallback_uri_image" }} style={styles.postImage} />
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    getSavedPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bài Viết Đã Lưu</Text>
      {!savedPosts.length ? (
        <Text style={styles.noPostsText}>Không có bài viết nào</Text>
      ) : (
        <FlatList
          data={savedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  noPostsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  postTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  postDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "#555555",
  },
});

export default SavedPostsScreen;
