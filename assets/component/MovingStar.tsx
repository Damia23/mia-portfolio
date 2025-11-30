import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

export default function MovingStar() {
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: screenWidth - 60, // move to right edge (minus image width)
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0, // move back to left edge
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateX, screenWidth]);

  return (
    <View style={styles.footer}>
      <Animated.Image
        source={require("../../assets/images/star.png")}
        style={[
          styles.star,
          {
            transform: [{ translateX }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "100%",
    height: 60,
    overflow: "hidden",
  },
  star: {
    width: 60,
    height: 60,
    position: "absolute",
    left: 0,
  },
});
