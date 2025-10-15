import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validateForm = () => {
    let newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={20} color="#888" />
        <TextInput
          style={[
            styles.input,
            errors.fullName && styles.inputError // משנה את המסגרת כשיש שגיאה
          ]}
          placeholder="Full Name"
          value={form.fullName}
          onChangeText={text => setForm({ ...form, fullName: text })}
        />
      </View>
      {errors.fullName
        ? <Text style={styles.errorText}>
            {errors.fullName}
          </Text>
        : null}

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={text => setForm({ ...form, email: text })}
        />
      </View>
      {errors.email
        ? <Text style={styles.errorText}>
            {errors.email}
          </Text>
        : null}

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={text => setForm({ ...form, password: text })}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? "visibility-off" : "visibility"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {errors.password
        ? <Text style={styles.errorText}>
            {errors.password}
          </Text>
        : null}

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={form.confirmPassword}
          onChangeText={text => setForm({ ...form, confirmPassword: text })}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialIcons
            name={showConfirmPassword ? "visibility-off" : "visibility"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword
        ? <Text style={styles.errorText}>
            {errors.confirmPassword}
          </Text>
        : null}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => validateForm()}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* כפתורי Google / Facebook */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={18} color="#db4a39" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
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
  inputError: {
    borderColor: "#ff5b5b"
  },
  errorText: {
    color: "#ff5b5b",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 4
  },
  registerButton: {
    backgroundColor: "#b8b8e6",
    borderRadius: 25,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 5
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
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
  }
});
