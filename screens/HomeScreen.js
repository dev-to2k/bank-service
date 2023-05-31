import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import MyCarousel from "../components/MyCarousel";
import Screen from "../components/Screen";
import Search from "../components/Search";
import { COLOR_PRIMARY } from "../constants";
import postApi from "../services/post";
import { shuffleArray } from "../utils/functions";

function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listRating, setListRating] = useState(null);

  const navigation = useNavigation();

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postApi.getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      Alert.alert("Error getting posts", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    async function getAverageRatings() {
      const averageRatings = await postApi.getAverageRatingsForPosts();
      setListRating(averageRatings);
    }

    getAverageRatings();
  }, []);

  const handlePostPress = (postId) => {
    navigation.navigate("PostDetail", { postId });
  };

  const renderRating = (postId) => {
    const currentPost = listRating?.find((rating) => rating.postId === postId);
    if (currentPost) {
      return currentPost.averageRating.toFixed(1);
    }
    return 0;
  };

  const renderPosts = () => {
    let filteredPosts = posts;

    if (searchText.trim() !== "") {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const randomPosts = shuffleArray(filteredPosts).slice(0, 5);

    if (randomPosts.length === 0) {
      return <Text style={styles.noPostsText}>No posts available.</Text>;
    }

    return (
      <ScrollView>
        {/* Render các bài viết ngẫu nhiên */}
        {randomPosts.map((post) => (
          <TouchableOpacity key={post.id} onPress={() => handlePostPress(post.id)}>
            <View style={styles.postContainer}>
              <View style={{ width: "30%" }}>
                <Image
                  source={{ uri: post.image || "fallback_image_uri" }}
                  style={styles.postImage}
                />
              </View>
              <View style={{ width: "70%", paddingLeft: 16 }}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                  <Text style={styles.postRating}>Đánh giá: {renderRating(post.id)}</Text>
                </View>
                <Text style={styles.postDescription}>{post.description}</Text>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.postCreatedAt}>
                    {moment(post?.createdAt).format("DD/MM/YYYY")} - by Admin
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Screen>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Search
          searchText={searchText}
          onSearch={handleSearchTextChange}
          placeholder="Tìm kiếm bài viết..."
        />
        <Text style={styles.textHeader}>Tin tức hôm nay</Text>
        <MyCarousel data={posts} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.textHeader}>Tin tức mới nhất</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AllPosts")}>
            <Text style={{ color: COLOR_PRIMARY, fontSize: 16, fontWeight: "bold" }}>
              Xem tất cả
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? <Text>Loading...</Text> : renderPosts()}
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 4,
    display: "flex",
    flexDirection: "row",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: "cover",
  },
  postDescription: {
    marginBottom: 8,
    color: "#555555",
  },
  postRating: {
    marginBottom: 8,
    color: "#888",
  },
  postCreatedAt: {
    color: "#888",
    fontSize: 14,
  },
  noPostsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#888",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default HomeScreen;
