import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { registerUser } from "../authApi";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const valid =
      form.fullName.trim() &&
      form.email.includes("@") &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword;
    setIsFormValid(valid);
  }, [form]);

  async function handleRegister(form) {
    try {
      const userPayload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password
      };

      const result = await registerUser(userPayload);
      Toast.show({
        type: "success",
        text1: "Registration Success",
        text2: result.gpt_response.response_from_gpt_server.message,
        position: "bottom"
      });
      console.log("Registration success:", result);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.detail || err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={form.fullName}
          onChangeText={(text) => setForm({ ...form, fullName: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.registerButton,
          {
            backgroundColor: isPressed
              ? "#27368F"
              : isFormValid
              ? "#3949AB"
              : "#b8b8e6"
          }
        ]}
        disabled={!isFormValid}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => handleRegister(form)}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.separatorLine} />
      </View>
      <View style={styles.socialContainer}>
    <TouchableOpacity
      style={[
        styles.socialButton,
        { opacity: isFormValid ? 1 : 0.1 }
      ]}
    >
      <FontAwesome name="google" size={18} color="#db4a39" />
      <Text style={styles.socialText}>Google</Text>
    </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton,
        { opacity: isFormValid ? 1 : 0.1 }]}>
          <FontAwesome name="facebook" size={18} color="#4267B2" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25
  },
  title: {
    fontSize: 26,
    color: "#3b53d2",
    fontWeight: "600",
    marginBottom: 25
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 15
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333"
  },
  registerButton: {
    borderRadius: 25,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 5
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%"
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc"
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#999",
    fontWeight: "500"
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    width: "48%",
    paddingVertical: 10
  },
  socialText: {
    marginLeft: 6,
    color: "#333",
    fontSize: 14
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
