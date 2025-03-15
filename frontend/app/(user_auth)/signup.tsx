import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { signUpUser } from './CognitoConfig.js';


const SignUp = () => {
  const styles = require('../globalStyles');
  
  // State to hold input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign up function
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const result = await signUpUser(username, password, email);
      setSuccessMessage('Sign-up successful!');
      // Optionally navigate after successful sign-up
      // router.push('/nextPage');
    } catch (err) {
      setError(err.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView automaticallyAdjustKeyboardInsets={true} className="bg-background">
        <SafeAreaView style={styles.screen}>
          <Image
            source={require("assets/Logo 1.png")}
            style={[{ width: 300, height: 150 }, { resizeMode: "contain" }]}
          />

          <View style={styles.container}>
            <View className="items-center m-4">
              <Text style={styles.titleText}>
                Welcome to Lore!
              </Text>
              <Text style={[styles.secondaryText, { fontSize: 12 }]}>
                Start your storytelling journey here.
              </Text>
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Password</Text>
              <TextInput
                style={styles.textInput}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mb-4">
              <Text style={styles.secondaryText}>Confirm Password</Text>
              <TextInput
                style={styles.textInput}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Show error message if any */}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}

            {/* Show success message if sign-up is successful */}
            {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

            <View className="m-4">
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}> Sign Up </Text>
              </TouchableOpacity>
              <Text
                style={[styles.linkText, { fontSize: 12 }]}
                onPress={() => { router.push("/"); }}
              >
                Already have an account?
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
