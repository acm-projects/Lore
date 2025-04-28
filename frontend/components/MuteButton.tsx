import { VolumeOff, Volume2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useAudio } from '~/context/AudioContext'

function MuteButton() {
    const { playSound, stopSound, toggleMute, isMuted } = useAudio()

    return (
        <View>
            {isMuted ? 
                <VolumeOff color={'white'}
                    onPress={() => {toggleMute(); }}>
                </VolumeOff> 
                : 
                <Volume2 color={'white'}
                    onPress={() => {toggleMute(); }}>
                </Volume2>}
        </View>
    )
}

export default MuteButton