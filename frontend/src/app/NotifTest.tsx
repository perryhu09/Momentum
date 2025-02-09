import { View, Text, Alert } from "react-native";
import React, { useEffect } from "react";
import io from "socket.io-client";

const NotifTest = () => {
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
  return (
    <View>
      <Text>Waiting for notifications...</Text>
    </View>
  );
};

export default NotifTest;
