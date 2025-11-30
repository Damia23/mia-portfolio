import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


interface RelatedWorkProps {
  onClose: () => void;
}

export default function RelatedWork({ onClose }: RelatedWorkProps) {
  const screen = Dimensions.get("window");
  const popupWidth = screen.width * 0.9;
  const popupHeight = screen.height * 0.85;

  const initialX = (screen.width - popupWidth) / 2;
  const initialY = (screen.height - popupHeight) / 2;

  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const projectPositions = useRef<number[]>([]).current;

  const figmaLink = 'https://www.figma.com/design/CJRmscdJ5GPyThvY8EmKnn/FarmByte-Design-System?node-id=0-1&t=DoOrPFehw1TEvDUo-1';
  const ohYeaLink = 'https://www.figma.com/design/hPvLYDREAmJ29zLgKpgQco/Untitled?t=DoOrPFehw1TEvDUo-1';
  
  const openFigma = () => {
    Linking.openURL(figmaLink);
  };

  const openOhYea = () => {
    Linking.openURL(ohYeaLink)
  }

  const projects = [
    "FarmByte Marketplace App",
    "AdaptByte Design System",
    "FarmByte App",
    "OhYea App",
  ];

  // Pop-in animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  // Reposition on resize
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      const newWidth = window.width * 0.9;
      const newHeight = window.height * 0.85;
      position.setValue({
        x: (window.width - newWidth) / 2,
        y: (window.height - newHeight) / 2,
      });
    });
    return () => sub?.remove();
  }, [position]);

  // Dragging logic
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

  // Scroll tracker
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    let current = 0;
    for (let i = 0; i < projectPositions.length; i++) {
      if (y >= projectPositions[i] - 100) current = i;
    }
    setActiveIndex(current);
  };

  const scrollToProject = (index: number) => {
    if (scrollRef.current && projectPositions[index] != null) {
      scrollRef.current.scrollTo({
        y: projectPositions[index],
        animated: true,
      });
    }
  };

  const onLayoutProject = (index: number, e: any) => {
    projectPositions[index] = e.nativeEvent.layout.y;
  };

  // ---------- Render Helpers ----------
  const renderProjectHeader = (title: string, year: string, type: string) => (
    <>
      <Text style={styles.projectTitle}>{`${title}`}</Text>
      <View style={styles.rowCenter}>
        <Text style={[styles.tag, styles.pinkTag]}>{year}</Text>
        <Text style={[styles.tag, styles.redTag]}>{type}</Text>
      </View>
    </>
  );

  const renderTechStack = (techs: string[]) => (
    <View style={styles.techRow}>
      {techs.map((tech) => (
        <Text key={tech} style={[styles.tag, styles.yellowTag]}>
          {tech}
        </Text>
      ))}
    </View>
  );

  const renderImage = (src: any) => {
    const { width } = Dimensions.get("window");
    const imageWidth = width * 0.9;
    const imageHeight = imageWidth * 0.4;

    return (
      <Image
        source={src}
        style={[styles.projectImage, { width: imageWidth, height: imageHeight }]}
        resizeMode="contain"
      />
    );
  };

  // ---------- MAIN ----------
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.popup,
        {
          width: popupWidth,
          height: popupHeight,
          transform: [...position.getTranslateTransform(), { scale: scaleAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Related Work</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content + Tracker */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Scroll Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* FarmByte Marketplace App 2025 */}
          <View onLayout={(e) => onLayoutProject(0, e)}>
            {renderProjectHeader("FarmByte Marketplace App", "2025", "Work Project")}
            {renderTechStack(["React Native Expo", "RTK Query", "Redux", "TypeScript", "Figma"])}
            {renderImage(require("../../assets/images/projects/marketplace_app.png"))}
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> Project Overview</Text>
            </View>
            <Text style={styles.sectionText}>
            The Marketplace App is part of an integrated farm-to-market ecosystem that connects farmers, B2B buyers and logistics partners to create a seamless supply chain experience. It allows buyers (from individuals to distributors and businesses) to browse, purchase and track fresh produce with ease, serving as a one-stop platform for convenient shopping and bulk orders.
            In this project, I focused on the frontend development of the Marketplace App. I helped build key user flows and interactive features that make the buying experience smooth and intuitive, while also ensuring consistent UI design and performance across platforms.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> App Features</Text>
            </View>
            <Text style={styles.sectionText}>- Product Listings & Management: Enables users to browse and search products through categorized listings with efficient data handling for smooth navigation.</Text>
            <Text style={styles.sectionText}>
              - Order Management System (OMS): Supports essential order operations, including add-to-cart, checkout, and order history tracking for a complete shopping flow.
            </Text>
            <Text style={styles.sectionText}>
            - Vouchers & Discounts: Provides marketing tools such as platform vouchers and referral-based discount programs to enhance user engagement.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> My Contributions</Text>
            </View>            
            <Text style={styles.sectionText}>
            In the first phase of the marketplace app, I focused on building the frontend experience. 
            I developed key modules like the My Addresses flow (using React Hook Form with Zod for validation), Request Refund, Star Harvest Listings, and the Notifications page. 
            I also built custom UI components such as a Scroll-to-Top button and a Camera uploader that supports up to six images. 
            I was involved in weekly deployment cycles using Firebase App Distribution for Android and TestFlight for iOS. 
            Additionally, I contributed to AdaptByte, our internal design system, by creating reusable layouts and UI components in Figma to maintain a consistent and cohesive design across the app.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> Technical Implementation</Text>
            </View>
            <Text style={styles.sectionText}>⚙️ Built with Expo for seamless cross-platform (iOS & Android) development.</Text>
            <Text style={styles.sectionText}>🧩 Managed global state using Redux Toolkit (RTK) and RTK Query for efficient data fetching and caching.</Text>
            <Text style={styles.sectionText}>📝 Handled form logic and validation with React Hook Form + Zod Schema.</Text>
            <Text style={styles.sectionText}>🎨 Designed the AdaptByte design system in Figma, creating reusable layouts and UI components that guided the component library implementation.</Text>

          </View>

          <View style={{alignSelf: 'center', margin: 40}}>
            <Text style={{fontSize: 30}}>. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.</Text>
          </View>

          {/* 🎉 AdaptByte Design System */}

          <View onLayout={(e) => onLayoutProject(1, e)}>
          {renderProjectHeader("AdaptByte Design System", "2025", "Work Project")}
          {renderTechStack(["Figma"])}
          {/* <TouchableOpacity  onPress={openFigma}>
          <Text style={styles.sectionText}>Open Figma Design</Text>
          </TouchableOpacity> */}
          <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> Project Overview</Text>
          </View>
          <Text style={styles.sectionText}>
          AdaptByte is a lightweight, modular React Native UI library focused on speed, simplicity, and adaptability. Built with react-native-unistyles, it offers clean and customizable components for scalable, high-performance apps.
          </Text>
          <View style={styles.spacer}/>
          <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> My Contributions</Text>
            </View>
          <Text style={styles.sectionText}>-Designed core components (e.g. buttons, form inputs, cards, icons)
          </Text>
          <Text style={styles.sectionText}>-Created typography + color guidelines
          </Text>
          <Text style={styles.sectionText}>-Wrote documentation for usage and component variations
          </Text>
          
          </View>

          <View style={{alignSelf: 'center', margin: 40}}>
            <Text style={{fontSize: 30}}>. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.</Text>
          </View>

          {/* 🌾 FarmByte App 2024 */}
          <View onLayout={(e) => onLayoutProject(2, e)}>
            {renderProjectHeader("FarmByte App", "2024", "Work Project")}
            {renderTechStack(["React Native CLI", "RTK Query", "Redux", "TypeScript", "Figma"])}
            {renderImage(require("../../assets/images/projects/farmbyte_app.png"))}
            
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> Project Overview</Text>
            </View>
            <Text style={styles.sectionText}>
            The FarmByte App is a digital platform that helps farmers plan, manage, and optimize their farming activities. It provides tools for better decision-making across planning, cultivation, harvesting, and selling, while streamlining workflows and automating key processes to improve overall efficiency. The app is available on both the App Store and Google Play.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> App Features</Text>
            </View>
            <Text style={styles.sectionText}>- Knowledge Base: Centralized hub for agriculture-related articles and learning resources, designed to support continuous farmer education and best practices.</Text>
            <Text style={styles.sectionText}>
              - Request to Sell (RTS): Streamlines the crop selling process through a guided workflow, enabling farmers to submit sales requests digitally and eliminate manual methods.
            </Text>
            <Text style={styles.sectionText}>- Pricing Analytics: Delivers real-time market price insights and trend analysis to help farmers make data-driven decisions and optimize profit margins.
            </Text>
            <Text style={styles.sectionText}>
            - Transactions: Provides full visibility into all transaction records and order histories, ensuring transparency, traceability, and financial accountability.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> My Contributions</Text>
            </View>
            <Text style={styles.sectionText}>
            I was part of the team that developed and launched the FarmByte App, a digital agriculture platform designed to help farmers manage their planning, farming, and harvesting activities more efficiently. As of January 2025, the app has onboarded over 3,000 registered farmers. My main focus was building the Request-to-Sell (RTS) workflows and integrating real-time notifications using Firebase Cloud Messaging and Notifee. I collaborated closely with the Product, Backend, and Mobile teams to enhance API performance and data synchronization, and contributed to the RTS module design in Figma, ensuring the user experience aligned with business goals and farmer needs.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> Technical Implementation</Text>
            </View>
            <Text style={styles.sectionText}>⚛️ Built with React Native CLI for a fully native mobile experience across iOS and Android.</Text>
            <Text style={styles.sectionText}>🔄 Used Redux and RTK Query for efficient state management and API data synchronization.</Text>
            <Text style={styles.sectionText}>🧠 Implemented TypeScript for robust type safety and scalable, maintainable code.</Text>
            <Text style={styles.sectionText}>🎨 Collaborated in Figma to design and refine UI components aligned with the app’s design system.</Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> User Feedback</Text>
            </View>
            {renderImage(require("../../assets/images/projects/farmbyte_user_review.png"))}
            <Text style={[styles.sectionText, { color: "pink", textAlign: "center" }]}>
              Feedback taken from farmbyte.com
            </Text>
          </View>

          <View style={{alignSelf: 'center', margin: 40}}>
            <Text style={{fontSize: 30}}>. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.</Text>
          </View>

          {/* 🎉 OhYea App 2023 */}
          <View onLayout={(e) => onLayoutProject(3, e)}>
            {renderProjectHeader("OhYea App", "2023", "Work Project")}
            {renderTechStack(["React Native CLI", "Redux", "Figma"])}
            {renderImage(require("../../assets/images/projects/ohyea_app.png"))}
            {/* <TouchableOpacity  onPress={openOhYea}>
          <Text style={styles.sectionText}>Open Figma Design</Text>
          </TouchableOpacity> */}

            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> Project Overview</Text>
            </View>
            <Text style={styles.sectionText}>
            OhYea App is a marketplace platform designed for buying and selling secondhand or thrifted apparel and goods. It supports core marketplace functionalities such as product listing, search, user authentication, cart management, and order processing. In addition to commerce features, the platform includes an event and bazaar module that allows users to explore ongoing or upcoming events, while sellers have the capability to create, manage, and host their own events or bazaars. 
            This creates an integrated ecosystem that combines social marketplace interactions with offline event engagement.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20} />
            <Text style={styles.sectionTitle}> My Contributions</Text>
            </View>
            <Text style={styles.sectionText}>
            I designed and developed major UI flows using Figma and implemented them using React Native CLI with Redux for state management, ensuring pixel-perfect accuracy. I worked in a team of two, where I was primarily responsible for the UI/UX design and front-end development. This role was a significant learning experience, as I was new to many of the tools and technologies and had to be hands-on throughout the process.
            </Text>
            <View style={styles.spacer}/>
            <View style={{flexDirection: 'row'}}>
            <Ionicons name="star-outline" size={20}  />
            <Text style={styles.sectionTitle}> Technical Implementation</Text>
            </View>
            <Text style={styles.sectionText}>
            🎨 Designed key user interfaces and app flows using Figma. Ensured accurate design translation and maintained visual consistency across screens.
            </Text>
            <Text style={styles.sectionText}>
            📱 Built the mobile application using React Native CLI with JavaScript. Created reusable and modular components and implemented screen navigation using React Navigation.
            </Text>
            <Text style={styles.sectionText}>
            🧠 Used traditional Redux for managing global state with actions, reducers, and a centralized store.
            </Text>
            <Text style={styles.sectionText}>
            🔗 Integrated RESTful APIs for user authentication, product marketplace, and event/bazaar modules. Tested and debugged APIs using Postman, and connected them to the app using JavaScript and Redux. Handled request/response lifecycle, loading states, and error handling manually.
            </Text>
            <Text style={styles.sectionText}>
            🗂️ Used Git for version control and GitHub for repository management, issue tracking, and collaboration.</Text>
          </View>

          <View style={{alignSelf: 'center', margin: 40}}>
            <Text style={{fontSize: 30}}>. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.</Text>
          </View>
          
        
        </ScrollView>

        {/* ✦ Right-side tracker with glow */}
        <View style={styles.trackerContainer}>
          {projects.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => scrollToProject(i)}
              activeOpacity={0.8}
              style={[
                styles.trackerDot,
                activeIndex === i && styles.trackerDotActive,
              ]}
            >
              <Text style={styles.trackerSymbol}>{activeIndex === i ? <Ionicons name="star" size={15} color="#edbbe7" /> : <Ionicons name="star-outline" size={15} color="#edbbe7"  />}</Text>
              
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFF0FA",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Pixelbasel-regular",
    color: "#000",
  },
  close: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 16,
    color: "#000",
  },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 20 },
  projectTitle: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 25,
    alignSelf: "center",
    marginBottom: 8,
  },
  rowCenter: { flexDirection: "row", alignSelf: "center", gap: 8 },
  tag: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 20,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  pinkTag: { backgroundColor: "#DFF6FF"},
  redTag: { backgroundColor: "#EBFFE9"},
  yellowTag: { backgroundColor: "#FBFFC7"},
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  projectImage: {
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  sectionTitle: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 20,
  },
  sectionText: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 18,
    lineHeight: 24,
  },
  spacer: { marginVertical: 10},

  // Tracker styles
  trackerContainer: {
    width: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
    gap: 20,
  },
  trackerDot: {
    padding: 2,
  },
  trackerDotActive: {
    transform: [{ scale: 1.4 }],
    shadowColor: "pink",
    // shadowOpacity: 0.9,
    // shadowRadius: 8,
    elevation: 10,
  },
  trackerSymbol: {
    fontFamily: "Pixelbasel-regular",
    fontSize: 15,
    color: "black",
  },
});
