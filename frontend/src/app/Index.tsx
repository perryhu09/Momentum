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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import LoginStyles from "../Styles/LoginStyles";

import axios from "axios";
import HomePageStyles from "../Styles/HomePageStyles";

const API_URL = "http://127.0.0.1:5001";
const PHONE_API_URL = "http://192.168.86.23:8081";

const api = axios.create({
  // baseURL: API_URL,
  baseURL: PHONE_API_URL,
});

const DATA: ItemData[] = [
  {
    id: "1",
    title: "Mountain Retreat",
    description: "Peaceful mountain cabin surrounded by nature",
    imageUrl:
      "https://api.a0.dev/assets/image?text=peaceful%20mountain%20cabin%20in%20nature%20sunset&aspect=4:5",
  },
  {
    id: "2",
    title: "Ocean Paradise",
    description: "Crystal clear waters and pristine beaches",
    imageUrl:
      "https://api.a0.dev/assets/image?text=tropical%20beach%20paradise%20aerial%20view&aspect=4:5",
  },
  {
    id: "3",
    title: "Urban Adventure",
    description: "Modern cityscape with vibrant culture",
    imageUrl:
      "https://api.a0.dev/assets/image?text=modern%20cityscape%20night%20neon%20lights&aspect=4:5",
  },
];

type ItemData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export default function HomePage() {
  const [albumTypes, setAlbumTypes] = useState([]);
  const [albums, setAlbums] = useState([[]]);

  const [randomAlbum, setRandomAlbum] = useState<ItemData>({
    id: "3",
    title: "Urban Adventure",
    description: "Modern cityscape with vibrant culture",
    imageUrl:
      "https://api.a0.dev/assets/image?text=modern%20cityscape%20night%20neon%20lights&aspect=4:5",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumTypes = await api.post("/");

        if (albumTypes.status == 201) {
          //fetched
        }
      } catch (err) {
        console.log("Error fetching album types", err);
      }

      try {
        const albumData = await api.post("/");
        if (albumData.status == 201) {
        }
      } catch (err) {
        console.log("Error fetching album types", err);
      }
      
    };
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: ItemData }) => (
    <Pressable
      style={HomePageStyles.cardContainer}
      onPress={() => console.log(`Pressed ${item.title}`)}
    >
      <View style={HomePageStyles.card}>
        <Image source={{ uri: item.imageUrl }} style={HomePageStyles.image} />
        <LinearGradient
          colors={["transparent", "rgb(0, 0, 0)"]}
          style={HomePageStyles.gradient}
        >
          <View style={HomePageStyles.textContainer}>
            <Text style={HomePageStyles.title}>{item.title}</Text>
            <Text style={HomePageStyles.description}>{item.description}</Text>
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
          {randomAlbum && (
            <Text style={HomePageStyles.subtitleText}>
              Daily Random Person's Story
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
          )}
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
            data={DATA} //Switch later
            renderItem={renderItem}
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
            Your Weekly and Monthly Stories
          </Text>
          <FlatList
            data={DATA} //Change
            renderItem={renderItem}
            horizontal
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
