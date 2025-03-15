import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { signUpUser, confirmUser } from './CognitoConfig.js';

const SignUp = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);

  const styles = require('../globalStyles');

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');

    if (!displayName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await signUpUser(email, password, displayName);
      setSuccessMessage('Sign-up successful! Please check your email for a confirmation code.');
      console.log("Switching to confirmation mode"); // Debugging
      setIsConfirmationMode(true); // Switch to confirmation mode
    } catch (err) {
      setError(err.message || 'An error occurred during sign-up.');
    }
  };

  const handleConfirmEmail = async () => {
    setError('');

    if (!confirmationCode.trim()) {
      setError('Please enter the confirmation code.');
      return;
    }

    try {
      await confirmUser(email, confirmationCode);
      setSuccessMessage('Your email has been successfully confirmed!');
      console.log("Email confirmed, redirecting...");
      
      // Redirect to login or home page after successful confirmation
      router.push('/home');
    } catch (err) {
      setError(err.message || 'Invalid confirmation code.');
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

            {!isConfirmationMode ? (
              <>
                {/* Sign-Up Form */}
                <View className="mb-4">
                  <Text style={styles.secondaryText}>Display Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your display name"
                  />
                </View>

                <View className="mb-4">
                  <Text style={styles.secondaryText}>Email (Username)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="Enter your email"
                  />
                </View>

                <View className="mb-4">
                  <Text style={styles.secondaryText}>Password</Text>
                  <TextInput
                    style={styles.textInput}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                  />
                </View>

                <View className="mb-4">
                  <Text style={styles.secondaryText}>Confirm Password</Text>
                  <TextInput
                    style={styles.textInput}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                  />
                </View>

                {error && <Text style={{ color: 'red' }}>{error}</Text>}
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
              </>
            ) : (
              <>
                {/* Confirmation Code Input */}
                <View className="mb-4">
                  <Text style={styles.secondaryText}>Enter Confirmation Code</Text>
                  <TextInput
                    style={styles.textInput}
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    keyboardType="numeric"
                    placeholder="Enter code from email"
                  />
                </View>

                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

                <View className="m-4">
                  <TouchableOpacity style={styles.button} onPress={handleConfirmEmail}>
                    <Text style={styles.buttonText}> Confirm Email </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
