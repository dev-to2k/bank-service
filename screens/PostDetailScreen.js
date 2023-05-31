import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Rating from "../components/Rating";
import postApi from "../services/post";
import { savePost, unSavePost } from "../utils/functions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: "contain",
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 16,
  },
  createdAt: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

function PostDetailScreen({ route }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [listRating, setListRating] = useState([]);

  const currentPost = listRating.find((rating) => rating.postId === postId);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (currentPost?.rating) {
      setRating(currentPost.rating);
    }
  }, [currentPost?.rating]);

  const handleRating = async (newRating) => {
    setRating(newRating);
    try {
      await postApi.ratePost(postId, newRating);
      console.log("Rating has been saved.");
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  const checkIfSaved = async (_postId) => {
    try {
      const savedPostsString = await AsyncStorage.getItem("savedPosts");
      const savedPostsArray = JSON.parse(savedPostsString);
      setIsSaved(savedPostsArray && savedPostsArray.includes(_postId));
    } catch (error) {
      console.log("Error checking saved posts:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPostPromise = postApi.getPostById(postId);
        const fetchedRatingPromise = postApi.getRatingsByPostId(postId);

        const [fetchedPost, fetchedRating] = await Promise.all([
          fetchedPostPromise,
          fetchedRatingPromise,
        ]);

        setPost(fetchedPost);
        // console.log("fetchedRating:", fetchedRating);
        setListRating(fetchedRating);
        checkIfSaved(postId);
      } catch (error) {
        console.error("Error getting post", error);
      }
    };

    fetchPost();
  }, [postId]);

  console.log("rating:", rating, currentPost?.rating);

  const handleSavePost = (_postId) => {
    setIsSaved(true);
    savePost(_postId);
  };

  const handleUnSavePost = (_postId) => {
    unSavePost(_postId);
    setIsSaved(false);
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Loading post...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: post.image ? post.image : "fallback_image_uri" }}
        style={styles.image}
      />
      <View style={styles.createdAt}>
        <Text>Ngày: {moment(post.createdAt).format("DD/MM/YYYY")}</Text>
        <Text style={{ marginLeft: 5 }}>
          {!isSaved ? (
            <Ionicons
              name="bookmark-outline"
              size={20}
              color="#000"
              onPress={() => handleSavePost(postId)}
            />
          ) : (
            <Ionicons
              name="bookmark"
              size={20}
              color="#000"
              onPress={() => handleUnSavePost(postId)}
            />
          )}
        </Text>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.description}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Mô tả:
        </Text>
        <Text style={{ width: "100%" }}>{post.description}</Text>
      </View>
      <View style={styles.description}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Nội dung:
        </Text>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      <Text
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        Đánh giá bài viết
      </Text>
      <Rating rating={rating} onPress={handleRating} />
    </ScrollView>
  );
}

export default PostDetailScreen;
