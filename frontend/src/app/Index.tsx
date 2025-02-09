import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LoginStyles from "../Styles/LoginStyles";
import HomePageStyles from "../Styles/HomePageStyles";
import useUserHomePageDataStore from "../store/useUserHomePageDataStore";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";

// Import the image map for local images
import { imageMap } from "./ImageMap";

const PHONE_API_URL = "http://192.168.86.23:8081";
const api = axios.create({
  baseURL: PHONE_API_URL,
});

type DataImage = {
  id: string;
  filename: string;
  uploaded_at: string | null;
};

type Album = {
  [title: string]: DataImage[];
};

type Story = DataImage[];

export default function HomePage() {
  const navigation = useNavigation();
  const {
    albums,
    stories,
    randomStories,
    setAlbums,
    setStories,
    setRandomStories,
  } = useUserHomePageDataStore();

  const fetchAlbums = async (user_id: string) => {
    try {
      const response = await api.get(`/albums/${user_id}`);
      if (response.status === 200) {
        setAlbums(response.data.albums);
      }
    } catch (err) {
      console.log("Error fetching user albums: ", err);
    }
  };

  const fetchStories = async (user_id: string) => {
    try {
      const response = await api.get(`/stories/${user_id}`);
      if (response.status === 200) {
        setStories(response.data.stories);
      }
    } catch (err) {
      console.log("Error fetching user's story: ", err);
    }
  };

  const fetchRandomStory = async (user_id: string) => {
    try {
      const response = await api.get(`/random_stories/${user_id}`);
      if (response.status === 201) {
        setRandomStories(response.data.stories);
      }
    } catch (err) {
      console.log("Error fetching random story: ", err);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id) {
        fetchAlbums(user_id);
        fetchStories(user_id);
        fetchRandomStory(user_id);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    // connect socket to flask server
    const socket = io("http://127.0.0.1:5001");

    // Listen for the notification event
    socket.on("notification", (data) => {
      Alert.alert("Notification", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Convert the albums object to an array for FlatList
  const albumEntries = Object.entries(albums).map(([title, images]) => ({
    title,
    images,
  }));

  const renderAlbum = ({
    item,
  }: {
    item: { title: string; images: DataImage[] };
  }) => {
    // Use the mapping object to get the image; fallback to a default image if not found
    const imageSource = imageMap[item.images[0].filename];

    return (
      <Pressable
        style={HomePageStyles.cardContainer}
        onPress={() => navigation.navigate("ViewAlbum")}
      >
        <View style={HomePageStyles.card}>
          <Image source={imageSource} style={HomePageStyles.image} />
          <LinearGradient
            colors={["transparent", "rgb(0, 0, 0)"]}
            style={HomePageStyles.gradient}
          >
            <View style={HomePageStyles.textContainer}>
              <Text style={HomePageStyles.title}>{item.title}</Text>
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    );
  };

  // Factory function to render stories with a given title
  const renderStoryWithTitle =
    (title: string) =>
    ({ item }: { item: Story }) => {
      const imageSource = imageMap[item[0].filename];

      return (
        <Pressable
          style={HomePageStyles.cardContainer}
          onPress={() => navigation.navigate("ViewStory")}
        >
          <View style={HomePageStyles.card}>
            <Image source={imageSource} style={HomePageStyles.image} />
            <LinearGradient
              colors={["transparent", "rgb(0, 0, 0)"]}
              style={HomePageStyles.gradient}
            >
              <View style={HomePageStyles.textContainer}>
                <Text style={HomePageStyles.title}>{title}</Text>
              </View>
            </LinearGradient>
          </View>
        </Pressable>
      );
    };

  return (
    <LinearGradient
      colors={["#19191a", "#454545"]}
      style={LoginStyles.gradient}
    >
      <ScrollView>
        <View style={HomePageStyles.container}>
          <View>
            <Text style={HomePageStyles.headerText}>Home</Text>
          </View>
          <View
            style={{
              width: "95%",
              backgroundColor: "#FFFFFF",
              height: 1,
              marginVertical: 10,
              alignSelf: "center",
            }}
          />
          <Text style={HomePageStyles.subtitleText}>Your Albums</Text>
          <FlatList
            data={albumEntries}
            renderItem={renderAlbum}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View
            style={{
              width: "95%",
              backgroundColor: "#FFFFFF",
              height: 1,
              marginVertical: 10,
              alignSelf: "center",
            }}
          />
          <Text style={HomePageStyles.subtitleText}>Your Weekly Story</Text>
          <FlatList
            data={stories}
            renderItem={renderStoryWithTitle("Your Story")}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={HomePageStyles.subtitleText}>
            View an Anonymous Person's Story
          </Text>
          <FlatList
            data={randomStories}
            renderItem={renderStoryWithTitle("An Anonymous Person's Story")}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={HomePageStyles.cameraButton}>
        <Ionicons name="camera-outline" color="#0" size={50} />
      </TouchableOpacity>
    </LinearGradient>
  );
}
