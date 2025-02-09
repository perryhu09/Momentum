import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import LoginStyles from "../Styles/LoginStyles";
import useUserHomePageDataStore from "../store/useUserHomePageDataStore";

import axios from "axios";
import HomePageStyles from "../Styles/HomePageStyles";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://127.0.0.1:5001";
const PHONE_API_URL = "http://192.168.86.23:8081";

const api = axios.create({
  // baseURL: API_URL,
  baseURL: PHONE_API_URL,
});

type DataImage = {
    id: string;
    filename: string;
    uploaded_at: string | null;
}

type Album = {
    [title: string]: DataImage[];
}

type Story = DataImage[];

export default function HomePage() {
    const navigation = useNavigation()
    const { albums, stories, randomStories, setAlbums, setStories, setRandomStories } = useUserHomePageDataStore();

  const fetchAlbums = async (user_id : string) => {
    try {
      const response = await api.get(`/albums/${user_id}`);
      if (response.status == 200) {
        setAlbums(response.data.albums)
      }
    } catch (err) {
      console.log("Error fetching user albums: ", err);
    }
  };

  const fetchStories = async (user_id : string) => {
    try {
      const response = await api.get(`/stories/${user_id}`);
      if (response.status == 200) {
        setStories(response.data.stories)
      }
    } catch (err) {
      console.log("Error fetching user's story: ", err);
    }
  };

  const fetchRandomStory= async (user_id : string) => {
    try {
      const response = await api.get(`/random_stories/${user_id}`);
      if (response.status == 201) {
        setRandomStories(response.data.stories)
      }
    } catch (err) {
      console.log("Error fetching random story: ", err);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
        const user_id = await AsyncStorage.getItem('user_id');
        if(user_id){
            fetchAlbums(user_id);
            fetchStories(user_id);
            fetchRandomStory(user_id);
        }
    };
    loadUserData();
  }, []);

  const albumEntries = Object.entries(albums).map(([title, images]) => ({
    title,
    images
  }));

  const renderAlbum = ({ item }: { item: { title: string, images: DataImage[] } }) => (
    <Pressable
      style={HomePageStyles.cardContainer}
      onPress={() => navigation.navigate('ViewAlbum')}
    >
      <View style={HomePageStyles.card}>
        <Image source={ require(WHAT TO PUT HERE item.images[0].filename doesn't work bc not full path)} style={HomePageStyles.image} />
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

  const renderStory = ({ item } : { item : Story }, title : string ) => (
    <Pressable
      style={HomePageStyles.cardContainer}
      onPress={() => navigation.navigate('ViewStory')}
    >
      <View style={HomePageStyles.card}>
        {/* FIXING REQUIRED RIGHT HEREERRRR: album cover (first image) */}
        <Image source={ require(item[0].filename) } style={HomePageStyles.image} />
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
          {/* {randomAlbum && (
            <Text style={HomePageStyles.subtitleText}>
                View an Anonymous Person's Story
            </Text>
          )}
          {randomAlbum && (
            <Pressable
              style={HomePageStyles.cardContainer}
              onPress={() => console.log(`Pressed ${randomAlbum.title}`)}
            >
              <View style={HomePageStyles.card}>
                <Image
                  source={{ uri: randomAlbum.imageUrl }}
                  style={HomePageStyles.image}
                />
                <LinearGradient
                  colors={["transparent", "rgb(0, 0, 0)"]}
                  style={HomePageStyles.gradient}
                >
                  <View style={HomePageStyles.textContainer}>
                    <Text style={HomePageStyles.title}>
                      {randomAlbum.title}
                    </Text>
                    <Text style={HomePageStyles.description}>
                      {randomAlbum.description}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          )} */}
          <View
            style={{
              width: "95%",
              backgroundColor: "#FFFFFF",
              height: 1,
              marginVertical: 10,
              alignSelf: "center",
            }}
          />
          ;<Text style={HomePageStyles.subtitleText}>Your Albums</Text>
          <FlatList
            data={albumEntries} //Switch later
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
          ;
          <Text style={HomePageStyles.subtitleText}>
            Your Weekly Story
          </Text>
          <FlatList
            data={stories} //Change
            renderItem={renderStory(stories, 'Your Story')}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={HomePageStyles.subtitleText}>
            View an Anonymous Person's Story 
          </Text>
          <FlatList
            data={randomStories} //Change
            renderItem={renderStory(stories, 'An Anonymous Person\'s Story')}
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