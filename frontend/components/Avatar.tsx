import React from 'react'
import {View,
        Image
 } from 'react-native'

function Avatar (props: {image: string, size: any})
{
    return( 
        <Image style={{width: props.size, height: props.size, borderRadius: props.size/2}} source={{uri : props.image}} />
    )
}

export default Avatar