import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface PopupContainerProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export default function PopupContainer({ children, onClose }: PopupContainerProps) {
  return (
    <View style={styles.overlay}>
      {/* Optional: tap outside to close */}
      {onClose && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      )}

      {/* Actual popup content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // dim background
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  content: {
    maxWidth: "90%",  // ensures popup doesn't overflow horizontally
    maxHeight: "85%", // ensures popup doesn't overflow vertically
  },
});
