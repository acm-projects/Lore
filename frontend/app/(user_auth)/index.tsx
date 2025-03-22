import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { signInUser } from './CognitoConfig'; // Adjust import path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const styles = require('../globalStyles');

  const handleSignIn = async () => {
    setError('');
    setSuccessMessage('');

    // ✅ Validate that email and password are entered
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    try {
      const result = await signInUser(email, password); // Use email for authentication
      setSuccessMessage('Login successful!');
      router.push('/home');  // Navigate to home screen after successful login
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    }

    router.push('/home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView automaticallyAdjustKeyboardInsets={true} className="bg-background">
        <SafeAreaView style={styles.screen}>
          <Image 
            source={require("assets/Logo 1.png")}
            style={[{width: 300, height:150}, {resizeMode: "contain"}]}>
          </Image>

          <View style={styles.container}>
            <View className="items-center m-4">
              <Text style={styles.titleText}>
                Welcome back!
              </Text>
              <Text style={[styles.secondaryText, {fontSize: 12}]}>
                Log in here with your Email and Password.
              </Text>
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Email</Text>
              <TextInput 
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}  // Update email state
              />
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Password</Text>
              <TextInput 
                style={styles.textInput}
                secureTextEntry
                value={password}
                onChangeText={setPassword}  // Update password state
              />
              <Text style={[styles.linkText, {fontSize: 12}]}>Forgot Password?</Text>
            </View>

            {/* Show error message if any */}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}

            {/* Show success message if login is successful */}
            {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

            <View className="mb-4">
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}> Login </Text>
              </TouchableOpacity>
              <Text className="" style={[styles.secondaryText, {fontSize: 12}]}>
                Don't have an account?
                <Text 
                  style={[styles.linkText, {fontSize: 12}]} 
                  onPress={() => {router.push("/(user_auth)/signup")}}>
                  Register
                </Text>
                <Text style={[styles.secondaryText, {fontSize: 12}]}>
                  here.
                </Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
