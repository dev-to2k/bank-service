import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const MyCarousel = ({ data }) => {
  const width = Dimensions.get("window").width;

  const getRandomPosts = (data, count) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Carousel
      loop
      width={width - 32}
      height={width / 2}
      autoPlay={true}
      data={getRandomPosts(data, 6)}
      style={styles.carouselContainer}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <View style={styles.carouselItem}>
          <Image style={styles.image} source={{ uri: item.image || "fallback_image_uri" }} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    // marginTop: 16,
    marginBottom: 16,
  },
  carouselItem: {
    // width: "100%",
    // height: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 5,
  },
});

export default MyCarousel;
