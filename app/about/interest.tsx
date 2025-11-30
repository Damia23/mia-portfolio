import DraggableSticker from "@/assets/component/DraggableSticker";
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

interface InterestProps {
  onClose: () => void;
}

export default function Interest({ onClose }: InterestProps) {
  // --- Screen size tracking ---
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));
  const { width: screenWidth, height: screenHeight } = screenSize;

  // --- Popup dimensions ---
  const POPUP_WIDTH = screenWidth * 0.8;
  const POPUP_HEIGHT = screenHeight * 0.7;

  // --- Initial centered position ---
  const position = useRef(
    new Animated.ValueXY({
      x: (screenWidth - POPUP_WIDTH) / 2,
      y: (screenHeight - POPUP_HEIGHT) / 2,
    })
  ).current;

  // --- Pop-in animation ---
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- Handle screen resize ---
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenSize(window);
      const newWidth = window.width * 0.8;
      const newHeight = window.height * 0.7;
      position.setValue({
        x: (window.width - newWidth) / 2,
        y: (window.height - newHeight) / 2,
      });
    });
    return () => sub.remove();
  }, [position]);

  // --- Drag popup anywhere ---
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
      onPanResponderRelease: () => position.flattenOffset(),
    })
  ).current;

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
      {/* --- Title bar --- */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>Skills</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* --- Content --- */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.intro}>
          ✿ These are the tools and technologies I love working with — from mobile
          development to UI magic ✨
        </Text>

        {/* --- Floating Logos --- */}
        <View style={styles.logoContainer}>
          <DraggableSticker
            source={require("../../assets/images/logo/react_native_logo.png")}
            initialPosition={{ x: -100, y: -40 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/expo_logo.png")}
            initialPosition={{ x: 80, y: -50 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/redux_logo.png")}
            initialPosition={{ x: -60, y: 40 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/firebase_logo.png")}
            initialPosition={{ x: 100, y: 20 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/typescript_logo.png")}
            initialPosition={{ x: -110, y: 120 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/javascript_logo.png")}
            initialPosition={{ x: 70, y: 130 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/figma_logo.png")}
            initialPosition={{ x: -40, y: 200 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/lottie_logo.png")}
            initialPosition={{ x: 100, y: 200 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/tamagui_logo.png")}
            initialPosition={{ x: -100, y: 260 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/unistyles_logo.png")}
            initialPosition={{ x: 50, y: 260 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/git_logo.png")}
            initialPosition={{ x: -60, y: 320 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/testflight_logo.png")}
            initialPosition={{ x: 90, y: 320 }}
          />
          <DraggableSticker
            source={require("../../assets/images/logo/jira_logo.png")}
            initialPosition={{ x: -20, y: 380 }}
          />
        </View>
      </ScrollView>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  intro: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 18,
    marginBottom: 16,
  },
  logoContainer: {
    position: "relative",
    width: "100%",
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
});


