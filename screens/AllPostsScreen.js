import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Search from "../components/Search";
import postApi from "../services/post";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 10,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    textTransform: "uppercase",
  },
  textContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  textCreatedAt: {
    fontSize: 12,
    color: "#999",
  },
});

function AllPostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

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

  const handlePostPress = (postId) => {
    navigation.navigate("PostDetail", { postId });
  };

  const handleSearchTextChange = (text) => {
    setSearch(text);
  };

  const renderPosts = () => {
    let filteredPosts = posts;

    if (search.trim() !== "") {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (!filteredPosts.length) {
      return <Text>Không tìm thấy bài viết</Text>;
    }

    return filteredPosts.map((post) => (
      <TouchableOpacity key={post.id} style={styles.item} onPress={() => handlePostPress(post.id)}>
        <Image source={{ uri: post.image || "fallback_uri_image" }} style={styles.image} />
        <Text style={styles.textTitle}>{post.title}</Text>
        <Text style={styles.textContent}>{post.description}</Text>
        <Text style={styles.textCreatedAt}>{moment(post.createdAt).fromNow()}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Search
        searchText={search}
        onSearch={handleSearchTextChange}
        placeholder={"Tìm kiếm bài viết..."}
      />

      {loading ? <Text>Loading...</Text> : renderPosts()}
    </ScrollView>
  );
}

export default AllPostsScreen;
