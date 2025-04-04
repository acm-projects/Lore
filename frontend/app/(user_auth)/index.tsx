import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { signInUser } from './CognitoConfig'; // Adjust import path if needed
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
      const result = await signInUser(email, password); // Use email for authentication
      setSuccessMessage('Login successful!');
      socket.emit('login_success');
      router.push('/home');  // Navigate to home screen after successful login
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    }
  };

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <Image className="w-full h-full" style={{ resizeMode: 'cover', position: 'absolute' }} source={require('assets/Loginbg.png')} />

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
              <View className="justify-center items-center">
                <Image 
                  source={require("assets/Logo 1.png")}
                  style={[{ width: 300, height: 150 }, { resizeMode: "contain" }]}
                />

                <View className="flex-1 bg-backgroundSecondary w-5/2 justify-center items-center rounded-xl">
                  <View className="items-center m-4">
                    <Text className="color-white items-center" style={{ fontSize: 20, fontFamily: 'JetBrainsMonoRegular' }}>
                      Welcome back!
                    </Text>
                    <Text className="color-secondaryText" style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                      Log in here with your Email and Password.
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="color-secondaryText pb-2" style={{ fontSize: 15, fontFamily: 'JetBrainsMonoRegular' }}>Email</Text>
                    <TextInput
                      className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]"
                      style={{ fontSize: 15 }}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor="#aaa"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="color-secondaryText pb-2" style={{ fontSize: 15, fontFamily: 'JetBrainsMonoRegular' }}>Password</Text>
                    <TextInput
                      className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]"
                      style={{ fontSize: 15 }}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#aaa"
                    />
                    <Text className="color-linkText pb-4" style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>Forgot Password?</Text>
                  </View>

                  {/* Show error message if any */}
                  {error && <Text style={{ color: 'red' }}>{error}</Text>}

                  {/* Show success message if login is successful */}
                  {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

                  <View className="mb-4">
                    <TouchableOpacity
                      className="items-center justify-center mb-2 rounded-3xl bg-primaryAccent color-white h-[40px] w-[285px]"
                      onPress={handleSignIn}
                    >
                      <Text className="color-white" style={{ fontFamily: 'JetBrainsMonoBold' }}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="items-center justify-center mb-2 rounded-3xl bg-primaryAccent color-white h-[40px] w-[285px]"
                      onPress={() => { router.push('/home') }}
                    >
                      <Text className="color-white" style={{ fontFamily: 'JetBrainsMonoBold' }}>Login</Text>
                    </TouchableOpacity>

                    <Text className="color-secondaryText pb-2" style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                      Don't Have an account?
                      <Text
                        className="color-linkText pb-4"
                        style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}
                        onPress={() => { router.push('/(user_auth)/signup') }}
                      >
                        Register
                      </Text>
                      <Text className="color-secondaryText pb-2" style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
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