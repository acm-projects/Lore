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

const SignUp = () => {
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
                                Welcome to Lore!
                            </Text>
                            <Text style={[styles.secondaryText, {fontSize: 12}]}>
                                Start your storytelling journey here.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text style={styles.secondaryText}>Name</Text>
                            <TextInput style={styles.textInput}/>
                        </View>

                        <View className="mb-4">
                            <Text style={styles.secondaryText}>Email</Text>
                            <TextInput style={styles.textInput}/>
                        </View>

                        <View className="mb-4">
                            <Text style={styles.secondaryText}>Password</Text>
                            <TextInput style={styles.textInput}/>
                        </View>

                        <View className="mb-4">
                            <Text style={styles.secondaryText}> Confirm Password</Text>
                            <TextInput style={styles.textInput}/>
                        </View>

                        <View className="m-4">
                            <TouchableOpacity style={styles.button} onPress={() => {router.push("/"); }}>
                              <Text style={styles.buttonText}> Sign Up </Text>
                            </TouchableOpacity>
                            <Text style={[styles.linkText, {fontSize: 12}]} onPress={() => {router.push("/"); }}> 
                                Already have an account? 
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default SignUp;