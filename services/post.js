import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app);

const postApi = {
  getAllPosts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      return posts;
    } catch (error) {
      console.error("Error getting posts:", error);
      throw new Error("Failed to fetch posts.");
    }
  },
  createPost: async (post) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), post);
      const createdPost = { id: docRef.id, ...post };
      return createdPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post.");
    }
  },
  deletePost: async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete post.");
    }
  },
  getPostById: async (postId) => {
    try {
      const docSnapshot = await getDoc(doc(db, "posts", postId));
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        throw new Error("Post not found.");
      }
    } catch (error) {
      console.error("Error getting post:", error);
      throw new Error("Failed to get post.");
    }
  },
  editPost: async (postId, newContent) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, newContent);
    } catch (error) {
      console.error("Error editing post:", error);
      throw new Error("Failed to edit post.");
    }
  },
  ratePost: async (postId, rating) => {
    console.log("Rating post:", postId, rating);
    try {
      const ratingRef = collection(db, "ratings");
      const ratingData = {
        postId: postId,
        rating: rating,
        timestamp: new Date().toISOString(),
      };
      await addDoc(ratingRef, ratingData);
    } catch (error) {
      console.error("Error rating post:", error);
      throw new Error("Failed to rate post.");
    }
  },
  getRatingsByPostId: async (postId) => {
    try {
      const ratingsRef = collection(db, "ratings");
      const q = query(ratingsRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);

      const ratings = [];
      querySnapshot.forEach((doc) => {
        ratings.push({ id: doc.id, ...doc.data() });
      });

      return ratings;
    } catch (error) {
      console.error("Error getting ratings:", error);
      throw new Error("Failed to get ratings.");
    }
  },
  calculateAverageRatingForPost: async (postId) => {
    try {
      const ratings = await postApi.getRatingsByPostId(postId);
      if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length;
        return averageRating;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating average rating for post:", error);
      throw new Error("Failed to calculate average rating for post.");
    }
  },
  getAverageRatingsForPosts: async () => {
    try {
      const posts = await postApi.getAllPosts();
      const averageRatingsPromises = posts.map(async (post) => {
        const averageRating = await postApi.calculateAverageRatingForPost(post.id);
        return { postId: post.id, averageRating };
      });
      const averageRatings = await Promise.all(averageRatingsPromises);
      return averageRatings;
    } catch (error) {
      console.error("Error getting average ratings for posts:", error);
      throw new Error("Failed to get average ratings for posts.");
    }
  },
};

export default postApi;
