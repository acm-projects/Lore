import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {   View, Text, Image, TextInput, TouchableWithoutFeedback, Keyboard, 
  ScrollView, TouchableOpacity, Alert,  
  StatusBar} from 'react-native';
import { signUpUser, confirmUser } from './CognitoConfig'; // Import authentication functions
import { useFonts } from 'expo-font';

const SignUp = () => {  
  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf')
  });

  // State to hold input values
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    displayName: '',
    emailFormat: '',
    passwordMismatch: '',
    passwordRequirements: '',
    confirmationCode: '',
    successMessage: '' // New state for success message
  });

  // Validate email format
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Handle sign-up
  const handleSignUp = async () => {
    setErrors({
      displayName: '',
      emailFormat: '',
      passwordMismatch: '',
      passwordRequirements: '',
      confirmationCode: '',
      successMessage: '' // Reset success message
    });
    
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
      Alert.alert('Sign-up Failed', (error as Error).message || 'Something went wrong.');
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
      router.push('(user_auth)'); 
    } catch (error) {
      Alert.alert('Confirmation Failed', (error as Error).message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
      <StatusBar />
        <View className="flex-1 bg-background">
          <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/Loginbg.png")}/> 
          <ScrollView automaticallyAdjustKeyboardInsets={true} className="">
            <View className="justify-center items-center">
              <Image 
                source={require("assets/Logo 1.png")}
                style={[{ width: 300, height: 150 }, { resizeMode: "contain" }]}>
              </Image>
              <View className="flex-1 bg-backgroundSecondary w-5/2 justify-center items-center rounded-xl">
                <View className="items-center m-4">
                  <Text className="color-white" style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}}>Welcome to Lore!</Text>
                  <Text className="color-secondaryText" style={{fontSize: 12, fontFamily: 'JetBrainsMonoRegular'}}>
                    Start your storytelling journey here.
                  </Text>
                </View>

                {!isCodeSent ? (
                  // Sign-up form
                  <>
                    <View className="mb-4">
                      <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Name</Text>
                      <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}
                        value={displayName} 
                        onChangeText={setDisplayName} 
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Email</Text>
                      <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Password</Text>
                      <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}
                        secureTextEntry 
                        value={password} 
                        onChangeText={setPassword} 
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Confirm Password</Text>
                      <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}
                        secureTextEntry 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword} 
                      />
                    </View>

                    <View className="m-4">
                      <TouchableOpacity className="items-center justify-center mb-2 rounded-3xl bg-primary h-[40px] w-[285px]" onPress={handleSignUp} disabled={loading}>
                        <Text className="color-white" style={{fontFamily: 'JetBrainsMonoBold'}}>
                          {loading ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                      </TouchableOpacity>    
                      <Text className="color-linkText" style={{fontSize: 12, fontFamily: 'JetBrainsMonoRegular'}} onPress={() => {router.push("/"); }}>
                        Already have an account? Log in here.
                      </Text>
                    </View>
                  </>
                ) : (
                  // Confirmation code input
                  <>
                    <View className="mb-4">
                      <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Enter Confirmation Code</Text>
                      <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}
                        value={confirmationCode} 
                        onChangeText={setConfirmationCode} 
                        keyboardType="numeric"
                      />
                    </View>

                    <View className="m-4">
                    <TouchableOpacity className="items-center justify-center mb-2 rounded-3xl bg-primaryAccent h-[40px] w-[285px]"
                                      onPress={handleConfirm} disabled={loading}>
                        <Text className="color-white" style={{fontFamily: 'JetBrainsMonoBold'}}>
                          {loading ? 'Confirming...' : 'Confirm'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;