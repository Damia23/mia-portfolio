import { useAudioPlayer } from 'expo-audio';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

import About from './about/about';
import Interest from './about/interest';
import Contact from './contact/contact';
import RelatedWork from './work/RelatedWork';

const BASE_WIDTH = 900;
const BASE_HEIGHT = 314;
const sparkleAudio = require('../assets/audio/sparkle.mp3');

export default function Index() {
  const router = useRouter();
  const player = useAudioPlayer(sparkleAudio);
  const { width, height } = useWindowDimensions();

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [showInterest, setShowInterest] = useState(false);

  const [fontsLoaded] = useFonts({
    'Pixelbasel-regular': require('../assets/fonts/Pixelbasel.ttf'),
    'Littledays-regular': require('../assets/fonts/Littledays.ttf'),
    'Hartache-regular': require('../assets/fonts/hartache.ttf'),
    'Stars-regular': require('../assets/fonts/Stars-Regular.ttf'),
    'Pixelbus-regular': require('../assets/fonts/pixelbus.ttf'),
  });

  // 🔹 Helper function for responsive sizes
  const { paddingHorizontal, titleFontSize, descFontSize } = useMemo(() => {
    if (width < 480) {
      // Small phones
      return {
        paddingHorizontal: 20,
        titleFontSize: 26,
        descFontSize: 14,
      };
    } else if (width < 1024) {
      // Tablets
      return {
        paddingHorizontal: 60,
        titleFontSize: 34,
        descFontSize: 22,
      };
    } else {
      // Desktop / web
      return {
        paddingHorizontal: 200,
        titleFontSize: 50,
        descFontSize: 30,
      };
    }
  }, [width]);

  const SCALE = width / BASE_WIDTH;
  const containerWidth = width * 0.9;
  const containerHeight = (BASE_HEIGHT / BASE_WIDTH) * containerWidth;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const fromCenter = (
    childW: number,
    childH: number,
    offsetX: number,
    offsetY: number
  ): ImageStyle => ({
    position: 'absolute',
    width: childW * SCALE,
    height: childH * SCALE,
    left: centerX + offsetX * SCALE - (childW * SCALE) / 2,
    top: centerY + offsetY * SCALE - (childH * SCALE) / 2,
  });

  const items = [
    {
      key: 'cake',
      source: require('../assets/images/mainpage/cake.svg'),
      w: 176,
      h: 151,
      offsetX: +100,
      offsetY: +50,
      onPress: () => setShowInterest(true),
    },
    {
      key: 'makeup',
      source: require('../assets/images/mainpage/makeup.svg'),
      w: 137,
      h: 106,
      offsetX: +250,
      offsetY: -20,
      onPress: () => {
        player.play();
        setShowContact(true);
      },
    },
    {
      key: 'frame',
      source: require('../assets/images/mainpage/frame.svg'),
      w: 185,
      h: 179,
      offsetX: 60,
      offsetY: -80,
      onPress: () => {
        player.play();
        setShowAbout(true);
      },
    },
    {
      key: 'computer',
      source: require('../assets/images/mainpage/computer.svg'),
      w: 405,
      h: 322,
      offsetX: -190,
      offsetY: -100,
      onPress: () => {
        player.play();
        setShowWork(true);
      },
    },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 💜 Responsive padding and text sizes */}
        <View style={{ paddingHorizontal }}>
          <Text
            style={{
              fontFamily: 'Pixelbasel-regular',
              fontSize: titleFontSize,
            }}
          >
            Hey there, I'm Damia
          </Text>
          <Text
            style={{
              fontFamily: 'Pixelbasel-regular',
              fontSize: descFontSize,
              marginTop: 10,
              lineHeight: descFontSize * 1.5,
            }}
          >
            I build React Native apps with a love for UI/UX and sleek mobile
            design. With nearly two years of experience, I enjoy turning ideas
            into beautiful, easy-to-use components that make apps feel just
            right.
          </Text>
        </View>

        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            marginTop: 200 * SCALE,
            alignSelf: 'center',
          }}
        >
          <Image
            source={require('../assets/images/mainpage/ellipse.svg')}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
          />
          {items.map((item) => (
            <TouchableOpacity key={item.key} onPress={item.onPress}>
              <Image
                source={item.source}
                style={fromCenter(item.w, item.h, item.offsetX, item.offsetY)}
                contentFit="contain"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={{ fontFamily: 'Pixelbasel-regular', fontSize: 20 }}>
            © 2025 Damia — All Rights Reserved
          </Text>
        </View>
      </ScrollView>

      {/* Popups */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
      {showContact && <Contact onClose={() => setShowContact(false)} />}
      {showWork && <RelatedWork onClose={() => setShowWork(false)} />}
      {showInterest && <Interest onClose={() => setShowInterest(false)} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  footer: {
    marginTop: 60,
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
