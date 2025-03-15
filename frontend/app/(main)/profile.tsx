import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOutUser } from '../(user_auth)/CognitoConfig.js';  // Import signOutUser from CognitoConfig
import { StyleSheet } from 'react-native';

const Profile = () => {
  const styles = require("../globalStyles");

  const handleSignOut = () => {
    signOutUser();  // Call the sign-out function
    router.push("/"); // Redirect to the login page after signing out
  };

  return (
    <SafeAreaView>
      <Text>Profile</Text>

      <View className="flex w-full h-1/3">
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}> Log Out </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
