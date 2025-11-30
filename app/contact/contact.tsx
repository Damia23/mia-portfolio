import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ContactProps {
  onClose: () => void;
}

export default function Contact({ onClose }: ContactProps) {
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));
  const screenWidth = screenSize.width;
  const screenHeight = screenSize.height;

  // Popup size (responsive)
  const POPUP_WIDTH = screenWidth * 0.7;
  const POPUP_HEIGHT = screenHeight * 0.6;

  const initialX = (screenWidth - POPUP_WIDTH) / 2;
  const initialY = (screenHeight - POPUP_HEIGHT) / 2;

  // Animation values
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  // Pop-in animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  // Drag handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x.__getValue(),
          y: position.y.__getValue(),
        });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        position.flattenOffset();
        Animated.spring(position, {
          toValue: { x: initialX, y: initialY },
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Re-center popup when screen resizes (web or rotation)
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenSize(window);
      const newWidth = window.width * 0.7;
      const newHeight = window.height * 0.6;
      position.setValue({
        x: (window.width - newWidth) / 2,
        y: (window.height - newHeight) / 2,
      });
    });

    return () => subscription?.remove();
  }, []);

  // Scrollbar size & position
  const scrollbarHeight = Math.max(
    20,
    (containerHeight / contentHeight) * containerHeight
  );
  const scrollBarTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(1, contentHeight - containerHeight)],
    outputRange: [0, Math.max(1, containerHeight - scrollbarHeight)],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.popup,
        {
          width: POPUP_WIDTH,
          height: POPUP_HEIGHT,
          transform: [...position.getTranslateTransform(), { scale: scaleAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Contact</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content + scrollbar */}
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, h) => setContentHeight(h)}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Text style={styles.contactText}>
            ✿ Email: miawork127@gmail.com{"\n"}
            ✿ Phone: +60 11-10615853{"\n"}
            ✿ GitHub: damia23{"\n\n"}
            Feel free to reach out for collaborations, freelance projects, or
            just to say hi!{"\n\n"}
            I’m most active on email, but you can also find me on LinkedIn and
            GitHub.
          </Text>
        </ScrollView>

        {/* Custom Scrollbar */}
        {/* <View style={styles.scrollBarTrack}>
          <Animated.View
            style={[
              styles.scrollBarThumb,
              {
                height: scrollbarHeight,
                transform: [{ translateY: scrollBarTranslateY }],
              },
            ]}
          />
        </View> */}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#999",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#FFF0FA",
  },
  titleText: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 20,
    color: "black",
  },
  close: {
    color: "black",
    fontFamily: "Pixelbasel-regular",
    fontWeight: "bold",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  contactText: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: "Pixelbasel-regular",
  },
  scrollBarTrack: {
    width: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    marginRight: 2,
  },
  scrollBarThumb: {
    width: 6,
    backgroundColor: "pink",
    borderRadius: 3,
  },
});
