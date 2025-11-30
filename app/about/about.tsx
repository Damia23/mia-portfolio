import DraggableSticker from "@/assets/component/DraggableSticker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface AboutProps {
  onClose: () => void;
}

export default function About({ onClose }: AboutProps) {
  // --- Screen size tracking ---
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));
  const { width, height } = useWindowDimensions();
  const screenWidth = screenSize.width;
  const screenHeight = screenSize.height;

  // --- Popup size and initial position ---
  const POPUP_WIDTH = screenWidth * 0.7;
  const POPUP_HEIGHT = screenHeight * 0.6;
  const initialX = (width - POPUP_WIDTH) / 2;
  const initialY = (height - POPUP_HEIGHT) / 2;

  // --- Animations ---
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- Scroll handling ---
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  const scrollbarHeight = containerHeight * (containerHeight / contentHeight);
  const scrollBarTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(1, contentHeight - containerHeight)],
    outputRange: [0, Math.max(1, containerHeight - scrollbarHeight)],
    extrapolate: "clamp",
  });

  // --- Dragging (PanResponder) ---
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
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
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

  // --- Listen for window resize (responsive recentering) ---
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
      {/* --- Header --- */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>About Me</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* --- Scrollable Content --- */}
      <View style={styles.scrollWrapper}>
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
          <Text style={styles.description}>
            ✿ My name is Nur Hanis Damia, you can call me, Mia! I build with purpose, polish and personality.
          </Text>

          {/* --- Profile with Stickers --- */}
          <View style={styles.profileContainer}>
            <Image
              source={require("../../assets/images/profile.svg")}
              style={styles.profileImage}
            />
            
            <DraggableSticker
              source={require("../../assets/images/stickers/gummy_bear.png")}
              initialPosition={{ x: -120, y: -40 }}
            />
            <DraggableSticker
              source={require("../../assets/images/stickers/bracelet.png")}
              initialPosition={{ x: 100, y: -50 }}
            />
            <DraggableSticker
              source={require("../../assets/images/stickers/star_rainbow.png")}
              initialPosition={{ x: -70, y: 80 }}
            />
            <DraggableSticker
              source={require("../../assets/images/stickers/phone.png")}
              initialPosition={{ x: 100, y: 90 }}
            />
          </View>

          <Text style={styles.description}>
            ✿ I’m a 00-born React Native developer from Kuala Lumpur with a degree in
            Information Systems Engineering — but my real education came from getting my
            hands dirty in code.
          </Text>

          <Text style={styles.description}>
            ✿ I specialize in building mobile apps with React Native and Expo, pairing tech
            with UI/UX design and a dash of animation flair.
          </Text>
        </ScrollView>

        {/* --- Custom Scrollbar --- */}
        {/* <View style={styles.scrollBarTrack}>
          <Animated.View
            style={[
              styles.scrollBarThumb,
              { height: scrollbarHeight, transform: [{ translateY: scrollBarTranslateY }] },
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
    padding: 8,
    backgroundColor: "#FFF0FA",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "Pixelbasel-regular",
    fontSize: 20,
  },
  close: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "Pixelbasel-regular",
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  description: {
    flexWrap: "wrap",
    fontFamily: "Pixelbasel-regular",
    fontSize: 20,
    marginBottom: 12,
  },
  profileContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
    height: 250,
  },
  profileImage: {
    width: "80%",
    height: "100%",
    resizeMode: "contain",
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

