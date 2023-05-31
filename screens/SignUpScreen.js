import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import { COLOR_PRIMARY } from "../constants";
import authApi from "../services/auth";

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc").min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    backgroundColor: COLOR_PRIMARY,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
  signUp: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapForm: {
    width: "75%",
    marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  signInWithSocial: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
    columnGap: 16,
  },
  signInWithFacebook: {
    backgroundColor: "#3b5998",
    width: "45%",
  },
  signInWithGoogle: {
    backgroundColor: "#db3236",
    width: "45%",
  },
  signIn: {
    backgroundColor: COLOR_PRIMARY,
  },
  textError: {
    color: "red",
    marginBottom: 16,
    textAlign: "left",
  },
  textSignIn: {
    color: COLOR_PRIMARY,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = async () => {
    try {
      await schema.validate({ email, password });
      // setErrors({});
      return true;
    } catch (error) {
      // setErrors(
      //   error.errors.reduce((acc, curr) => {
      //     console.log(curr.path);
      //     console.log(curr.message);
      //     acc[curr.path] = curr.message;
      //     return acc;
      //   }, {})
      // );

      console.log(error);
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const isValid = await validate();
      if (isValid) {
        const user = await authApi.register(email, password);
        if (user instanceof Error) {
          Alert.alert("Failed to sign up", user.message);
        } else {
          navigation.navigate("Home");
          Alert.alert("Đăng ký", "Đăng ký thành công!");
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <View style={styles.wrapForm}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        {errors?.email && <Text style={styles.textError}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        {errors?.password && <Text style={styles.textError}>{errors.password}</Text>}

        <Text style={[styles.button, styles.signUp]} onPress={handleSignUp}>
          {loading ? "Loading..." : "Đăng ký"}
        </Text>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.text}>Bạn đã có tài khoản?</Text>
          <Text style={styles.textSignIn} onPress={() => navigation.navigate("SignIn")}>
            Đăng nhập
          </Text>
        </View>

        <View style={styles.signInWithSocial}>
          <Text style={[styles.button, styles.signInWithFacebook]}>Facebook</Text>
          <Text style={[styles.button, styles.signInWithGoogle]}>Google</Text>
        </View>
      </View>
    </View>
  );
}

export default SignUpScreen;
