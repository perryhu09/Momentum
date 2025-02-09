import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LoginStyles from "../Styles/LoginStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:5001";

const api = axios.create({
  baseURL: API_URL,
});

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = new Animated.Value(1);
  const [errorMessage, setErrorMessage] = useState("");
  const backendon = false;

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill out all input fields!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      const user_id = response.data.user_id;
      await AsyncStorage.setItem("user_id", user_id);
      console.log("response status: ", response.status);
    } catch (err: any) {
      if (err.response.status === 401) {
        setErrorMessage("Invalid Credentials");
      } else {
        setErrorMessage("Server Failed, please try again");
      }
    }
    setIsLoading(false);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={LoginStyles.container}
    >
      <LinearGradient
        colors={["#19191a", "#454545"]}
        style={LoginStyles.gradient}
      >
        <View style={LoginStyles.loginContainer}>
          <Text style={LoginStyles.title}>Login</Text>

          <View style={LoginStyles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={LoginStyles.inputIcon}
            />
            <TextInput
              style={LoginStyles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={LoginStyles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={LoginStyles.inputIcon}
            />
            <TextInput
              style={LoginStyles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={LoginStyles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              animateButton();
              handleLogin();
            }}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                LoginStyles.loginButton,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={LoginStyles.loginButtonText}>Login</Text>
              )}
            </Animated.View>
          </TouchableOpacity>

          <View style={LoginStyles.signupContainer}>
            <Text style={LoginStyles.signupText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={LoginStyles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          {errorMessage && (
            <View style={{ justifyContent: "center", flexDirection: "row" }}>
              <Text style={LoginStyles.errorMessage}>{errorMessage}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
