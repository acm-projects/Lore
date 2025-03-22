import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, 
  ScrollView, TouchableOpacity, Alert 
} from 'react-native';
import { signUpUser, confirmUser } from './CognitoConfig'; // Import authentication functions

const SignUp = () => {
  const styles = require('../globalStyles');

  // State variables for user input
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle sign-up
  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signUpUser(email, password, displayName);
      Alert.alert('Success', 'Sign-up successful! Please check your email for the confirmation code.');
      setIsCodeSent(true); // Show confirmation code input
    } catch (error) {
      Alert.alert('Sign-up Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!confirmationCode) {
      Alert.alert('Error', 'Please enter the confirmation code.');
      return;
    }

    setLoading(true);

    try {
      await confirmUser(email, confirmationCode);
      Alert.alert('Success', 'Your account has been confirmed! You can now log in.');
      router.push('(user_auth)'); // Navigate to login page
    } catch (error) {
      Alert.alert('Confirmation Failed', error.message || 'Invalid code.');
    } finally {
      setLoading(false);
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
              <Text style={styles.titleText}>Welcome to Lore!</Text>
              <Text style={[styles.secondaryText, { fontSize: 12 }]}>
                Start your storytelling journey here.
              </Text>
            </View>

            {!isCodeSent ? (
              // Sign-up form
              <>
                <View className="mb-4">
                  <Text style={styles.secondaryText}>Name</Text>
                  <TextInput 
                    style={styles.textInput} 
                    value={displayName} 
                    onChangeText={setDisplayName} 
                  />
                </View>

                <View className="mb-4">
                  <Text style={styles.secondaryText}>Email</Text>
                  <TextInput 
                    style={styles.textInput} 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                <View className="m-4">
                  <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    <Text style={styles.buttonText}>
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // Confirmation code input
              <>
                <View className="mb-4">
                  <Text style={styles.secondaryText}>Enter Confirmation Code</Text>
                  <TextInput 
                    style={styles.textInput} 
                    value={confirmationCode} 
                    onChangeText={setConfirmationCode} 
                    keyboardType="numeric"
                  />
                </View>

                <View className="m-4">
                  <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
                    <Text style={styles.buttonText}>
                      {loading ? 'Confirming...' : 'Confirm'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={[styles.linkText, { fontSize: 12 }]} onPress={() => router.push('(user_auth)')}> 
              Already have an account? Log in here.
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
