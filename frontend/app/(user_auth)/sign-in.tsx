import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { signInUser, getUserAttributes } from './CognitoConfig'; // Adjust import path if needed
import { useFonts } from 'expo-font';
import { socket } from '~/socket';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignIn = async () => {
    setError('');
    setSuccessMessage('');

    // ✅ Validate that email and password are entered
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    try {
      // Sign in the user
      const result = await signInUser(email, password);
      setSuccessMessage('Login successful!');

      // Wait a moment for Cognito to complete token storage
      setTimeout(async () => {
        try {
          // Try to get user attributes
          const attributes = await getUserAttributes();
          console.log('User attributes:', attributes);

          // Navigate to home screen after successful login
          router.replace('/home');
        } catch (attrErr) {
          console.error('Error getting user attributes:', attrErr);
          // Still navigate to home since login was successful
          router.replace('/home');
        }
      }, 500);
    } catch (err) {
      console.error('Sign in error:', err);
      setError((err as Error).message || 'Invalid email or password.');
    }
  };

  useFonts({
    JetBrainsMonoRegular: require('assets/fonts/JetBrainsMonoRegular.ttf'),
    JetBrainsMonoBold: require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <Image
          className="h-full w-full"
          style={{ resizeMode: 'cover', position: 'absolute' }}
          source={require('assets/Loginbg.png')}
        />

        {/* Wrap the content with TouchableWithoutFeedback to dismiss keyboard on tap */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {/* Wrap everything in a KeyboardAvoidingView to prevent keyboard overlap */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for iOS
          >
            <ScrollView
              automaticallyAdjustKeyboardInsets={true}
              keyboardShouldPersistTaps="handled" // This allows taps on inputs even if the keyboard is visible
            >
              <View className="items-center justify-center">
                <Image
                  source={require('assets/Logo 1.png')}
                  style={[{ width: 300, height: 150 }, { resizeMode: 'contain' }]}
                />

                <View className="w-5/2 flex-1 items-center justify-center rounded-xl bg-backgroundSecondary">
                  <View className="m-4 items-center">
                    <Text
                      className="items-center color-white"
                      style={{ fontSize: 20, fontFamily: 'JetBrainsMonoRegular' }}>
                      Welcome back!
                    </Text>
                    <Text
                      className="color-secondaryText"
                      style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                      Log in here with your Email and Password.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text
                      className="pb-2 color-secondaryText"
                      style={{ fontSize: 15, fontFamily: 'JetBrainsMonoRegular' }}>
                      Email
                    </Text>
                    <TextInput
                      className="h-[40px] w-[285px] rounded-xl bg-black pl-2 color-white"
                      style={{ fontSize: 15 }}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor="#2d2e33"
                    />
                  </View>

                  <View className="mb-4">
                    <Text
                      className="pb-2 color-secondaryText"
                      style={{ fontSize: 15, fontFamily: 'JetBrainsMonoRegular' }}>
                      Password
                    </Text>
                    <TextInput
                      className="h-[40px] w-[285px] rounded-xl bg-black pl-2 color-white"
                      style={{ fontSize: 15 }}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#2d2e33"
                    />
                    <Text
                      className="pb-4 color-linkText"
                      style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                      Forgot Password?
                    </Text>
                  </View>

                  {/* Show error message if any */}
                  {error && (
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'JetBrainsMonoRegular',
                        paddingBottom: 6,
                      }}>
                      {error}
                    </Text>
                  )}

                  {/* Show success message if login is successful */}
                  {successMessage && (
                    <Text
                      style={{
                        color: 'green',
                        fontFamily: 'JetBrainsMonoRegular',
                        paddingBottom: 6,
                      }}>
                      {successMessage}
                    </Text>
                  )}

                  <View className="mb-4">
                    <TouchableOpacity
                      className="mb-2 h-[40px] w-[285px] items-center justify-center rounded-3xl bg-primaryAccent color-white"
                      onPress={handleSignIn}>
                      <Text className="color-white" style={{ fontFamily: 'JetBrainsMonoBold' }}>
                        Login
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="mb-2 h-[40px] w-[285px] items-center justify-center rounded-3xl bg-secondaryText color-white"
                      onPress={() => {
                        router.push('/(user_auth)/guestDetails');
                      }}>
                      <Text className="color-white" style={{ fontFamily: 'JetBrainsMonoBold' }}>
                        Continue as Guest
                      </Text>
                    </TouchableOpacity>

                    <Text
                      className="pb-2 color-secondaryText"
                      style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                      Don't Have an account?
                      <Text
                        className="pb-4 color-linkText"
                        style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}
                        onPress={() => {
                          router.push('/(user_auth)/signup');
                        }}>
                        Register
                      </Text>
                      <Text
                        className="pb-2 color-secondaryText"
                        style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                        here.
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default Login;
