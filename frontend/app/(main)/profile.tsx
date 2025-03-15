import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const Profile = () => {
  const styles = require("../globalStyles")
  return (
    <SafeAreaView>
      <Text>Profile</Text>

      <View className="flex w-full h-1/3">
            <TouchableOpacity style={styles.button} onPress={() => {router.push("/"); }}>
              <Text style={styles.buttonText}> Log Out </Text>
            </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default Profile;
