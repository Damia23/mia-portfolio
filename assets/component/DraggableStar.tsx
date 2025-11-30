import React, { useRef } from "react";
import { Animated, Image, PanResponder, StyleSheet } from "react-native";

export default function DraggableStar({ 
  initialPosition = {x:0, y:0}, 
  size = 58 
}: { 
  initialPosition?: { x: number; y: number };
  size?: number;
}) {
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store the current position as the offset
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 }); // reset so movement is relative
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // Merge offset + value into a new offset and reset value to zero
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.star, { 
        transform: pan.getTranslateTransform(),
        width: size,
        height: size
      }]}
      {...panResponder.panHandlers}
    >
      <Image 
        source={require("../../assets/images/star_pink.svg")} 
        style={{ 
          width: size, 
          height: size,
          resizeMode: 'contain'
        }} 
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: "absolute",
  },
});