import { useFonts } from 'expo-font';
import React, { useState } from 'react'
import {View,
        Image,
        SafeAreaView,
        Text,
        TouchableOpacity
 } from 'react-native'

function Avatar (props: {size: number, image: string})
{
    useFonts({
        'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
        'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf')
    });
    
    return( 
        <View>
            <Image style={{width: props.size, height: props.size, shadowOpacity: .5, shadowRadius: 10, shadowColor: 'black'}} className="rounded-full"
                    source={{uri : props.image}}>
            </Image>
        </View>
    )
}

export default Avatar