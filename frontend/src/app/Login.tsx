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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = new Animated.Value(1);
  const [serverMessage, setServerMessage] = useState("server not found");
  const backendon = false;

  const API_URL = "http://127.0.0.1:5001";

  const api = axios.create({
    baseURL: API_URL,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", { email, password });

      if (response.status == 200) {
      } else {
        setServerMessage("Invalid Credentials");
      }
    } catch (err) {
      console.error("Error Logging In");
      setServerMessage("Server Failed, please try again");
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
          {serverMessage && (
            <View style={{ justifyContent: "center", flexDirection: "row" }}>
              <Text style={LoginStyles.serverMessage}>{serverMessage}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
