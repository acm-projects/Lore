import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, 
         Text, 
         Image, 
         TextInput, 
         TouchableWithoutFeedback, 
         Keyboard, 
         ScrollView,
         StyleSheet,
         TouchableOpacity, } from 'react-native';

const Login = () => {
    const styles = require('../globalStyles');
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
                            <TextInput style={styles.textInput}/>
                        </View>

                        <View className="mb-4">
                            <Text style={styles.secondaryText}>Password</Text>
                            <TextInput style={styles.textInput}/>
                            <Text style={[styles.linkText, {fontSize: 12}]}>Forgot Password?</Text>
                        </View>
                        <View className="mb-4">
                            <TouchableOpacity style={styles.button} onPress={() => {router.push("/(main)/home"); }}>
                              <Text style={styles.buttonText}> Login </Text>
                            </TouchableOpacity>
                            <Text className="" style={[styles.secondaryText, {fontSize: 12}]}>
                                Don't Have an account?
                                <Text style={[styles.linkText, {fontSize: 12}]} 
                                      onPress={() => {router.push("/(user_auth)/signup")}}> Register </Text>
                                <Text style={[styles.secondaryText, {fontSize: 12}]}>
                                    here.
                                </Text>
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Login;