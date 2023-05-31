import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import { COLOR_PRIMARY } from "../constants";
import { UserContext } from "../contexts/userContext";

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
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
  textSignIn: {
    color: COLOR_PRIMARY,
    marginLeft: 4,
    fontWeight: "bold",
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
    width: "50%",
  },
  signInWithGoogle: {
    backgroundColor: "#db3236",
    width: "50%",
  },
  signIn: {
    backgroundColor: COLOR_PRIMARY,
  },
  textError: {
    color: "red",
    marginBottom: 16,
  },
});

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function SignInScreen() {
  const { loading, handleLogin, handleLoginFacebook, handleLoginGoogle } =
    useContext(UserContext);

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = async () => {
    try {
      await schema.validate({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      setErrors(
        error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {})
      );
      return false;
    }
  };

  const onLogin = async () => {
    try {
      const isValid = await validate();

      if (isValid) {
        handleLogin(email, password);
        setErrors({});
        return true;
      }
    } catch (error) {
      Alert.alert("Thông báo", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
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
          placeholder="Mật khẩu"
          secureTextEntry
        />
        {errors?.password && <Text style={styles.textError}>{errors.password}</Text>}
        <Text
          color={COLOR_PRIMARY}
          style={[styles.button, styles.signIn]}
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator style={styles.loadingIndicator} /> : "Đăng nhập"}
        </Text>
        <View style={styles.signUp}>
          <Text>Chưa có tài khoản?</Text>
          <Text
            style={[styles.text, styles.textSignIn]}
            onPress={() => navigation.navigate("SignUp")}
          >
            Đăng ký
          </Text>
        </View>

        <View
          style={{
            marginTop: 16,
            maxWidth: 300,
            textAlign: "center",
          }}
        >
          <Text style={styles.text}>Hoặc đăng nhập với </Text>

          <View style={styles.signInWithSocial}>
            <Text
              style={[styles.button, styles.signInWithFacebook]}
              // disabled={!request}
              onPress={handleLoginFacebook}
            >
              Facebook
            </Text>
            <Text style={[styles.button, styles.signInWithGoogle]} onPress={handleLoginGoogle}>
              Google
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SignInScreen;
