import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import CameraStyles from "../Styles/CameraStyles";

import * as FileSystem from "expo-file-system";

import axios from "axios";
import PhotoPreviewStyles from "../Styles/PhotoPreviewStyles";

const API_URL = "http://127.0.0.1:5001";
const PHONE_API_URL = "http://192.168.86.23:5001"; // FOR CAMERA TESTING ON IPHONE

const api = axios.create({
  // baseURL: API_URL,
  baseURL: PHONE_API_URL,
});

const CameraPage = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={CameraStyles.container}>
        <Text style={{ textAlign: "center" }}>
          Please grant this app access to your camera!
        </Text>

        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCamera() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });

      setPhoto(photo);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);
  const handleConfirm = async () => {
    //TODO: Navigate to home
    const uri = photo.uri;
    const user_id = 1; // !!! ------ CHANGE LATER THIS FOR TESTING PURPOSES ONLY RIGHT NOW ------ !!!
    const fileExtension = uri.split(".").pop();

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        console.log("filesize uri: ", fileInfo.size);
      } else {
        console.error("File does not exist");
      }
    } catch (error) {
      console.error("Error reading file info:", error);
      
    }
    interface FileData {
      uri: string;
      type: string;
      filename: string;
    }

    const formData = new FormData();
    
    formData.append('file', {  
      uri: photo.uri,
      name: `photo.${fileExtension}`,
      type: `image/${fileExtension}`,
    } as unknown as Blob);
    formData.append("user_id", user_id.toString());

    try {
      const response = await api.post("/upload_image", formData, {
        headers:{
          
        }
      });
      if (response.status == 201) {
        console.log("Successfuly added imag");
      }
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };
  if (photo)
    return (
      <SafeAreaView style={PhotoPreviewStyles.container}>
        <View style={PhotoPreviewStyles.box}>
          <Image
            source={{ uri: photo.uri }}
            style={PhotoPreviewStyles.previewContainer}
          />
        </View>

        <View style={PhotoPreviewStyles.buttonContainer}>
          <TouchableOpacity
            style={PhotoPreviewStyles.button}
            onPress={handleRetakePhoto}
          >
            <Ionicons name="trash" size={36} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={PhotoPreviewStyles.button}
            onPress={handleConfirm}
          >
            <Ionicons name="arrow-forward-outline" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  return (
    <View style={CameraStyles.container}>
      <CameraView style={CameraStyles.camera} facing={facing} ref={cameraRef}>
        <View style={CameraStyles.buttonContainer}>
          <TouchableOpacity style={CameraStyles.button} onPress={toggleCamera}>
            <Ionicons name="camera-reverse-outline" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={CameraStyles.button} onPress={takePhoto}>
            <Ionicons name="camera" size={40} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraPage;
