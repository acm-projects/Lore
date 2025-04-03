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
} from 'react-native';
import { signInUser, getUserAttributes } from './CognitoConfig'; // Adjust import path if needed
import { useFonts } from 'expo-font';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignIn = async () => {
    router.push('/home');
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
      getUserAttributes();
      router.push('/home'); // Navigate to home screen after successful login
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    }
  };

  useFonts({
    JetBrainsMonoRegular: require('assets/fonts/JetBrainsMonoRegular.ttf'),
    JetBrainsMonoBold: require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 bg-background">
          <Image
            className="h-full w-full"
            style={{ resizeMode: 'cover', position: 'absolute' }}
            source={require('assets/Loginbg.png')}
          />

          <ScrollView automaticallyAdjustKeyboardInsets={true} className="">
            <View className="items-center justify-center">
              <Image
                source={require('assets/Logo 1.png')}
                style={[{ width: 300, height: 150 }, { resizeMode: 'contain' }]}></Image>

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
                  />
                  <Text
                    className="pb-4 color-linkText"
                    style={{ fontSize: 12, fontFamily: 'JetBrainsMonoRegular' }}>
                    Forgot Password?
                  </Text>
                </View>

                {/* Show error message if any */}
                {error && <Text style={{ color: 'red' }}>{error}</Text>}

                {/* Show success message if login is successful */}
                {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

                <View className="mb-4">
                  <TouchableOpacity
                    className="mb-2 h-[40px] w-[285px] items-center justify-center rounded-3xl bg-primaryAccent color-white"
                    onPress={() => {
                      handleSignIn();
                    }}>
                    <Text className="color-white" style={{ fontFamily: 'JetBrainsMonoBold' }}>
                      {' '}
                      Login{' '}
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
                      {' '}
                      Register{' '}
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
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
