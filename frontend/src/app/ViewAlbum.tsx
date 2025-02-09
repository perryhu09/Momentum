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

import GalleryStyles from "../Styles/GalleryStyles";

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

export default function ViewAlbum() {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumTypes = await api.post("/");

        if (albumTypes.status == 201) {
          //fetched
        }
      } catch (err) {
        console.log("Error fetching gallery pictures", err);
      }

      try {
        const albumData = await api.post("/");
        if (albumData.status == 201) {
        }
      } catch (err) {
        console.log("Error fetching gallery pictures", err);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: ItemData }) => (
    <Pressable
      style={GalleryStyles.cardContainer}
      onPress={() => console.log(`Pressed ${item.title}`)}
    >
      <View style={GalleryStyles.card}>
        <Image source={{ uri: item.imageUrl }} style={GalleryStyles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={GalleryStyles.gradient}
        ></LinearGradient>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#19191a", "#454545"]}
      style={LoginStyles.gradient}
    >
      <View style={GalleryStyles.container}>
        <View>
          <Text style={GalleryStyles.headerText}>Gallery View</Text>
        </View>
        <Text style={GalleryStyles.subtitleText}>Photos</Text>
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
      </View>
    </LinearGradient>
  );
}
