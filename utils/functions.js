import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePost = async (postId) => {
  try {
    const savedPosts = await AsyncStorage.getItem("savedPosts");
    let savedPostsArray = JSON.parse(savedPosts);
    if (!savedPostsArray) {
      savedPostsArray = [];
    }
    if (!savedPostsArray.includes(postId)) {
      savedPostsArray.push(postId);
      await AsyncStorage.setItem("savedPosts", JSON.stringify(savedPostsArray));
    }
  } catch (error) {
    console.log("Lỗi khi lưu bài viết:", error);
  }
};

export const unSavePost = async (postId) => {
  try {
    const savedPosts = await AsyncStorage.getItem("savedPosts");
    let savedPostsArray = JSON.parse(savedPosts);
    if (!savedPostsArray) {
      return;
    }
    const updatedSavedPosts = savedPostsArray.filter((savedPostId) => savedPostId !== postId);
    await AsyncStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
  } catch (error) {
    console.log("Lỗi khi bỏ lưu bài viết:", error);
  }
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
