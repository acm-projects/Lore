import React, { createContext, useContext, useRef, useState } from 'react';
import { Audio } from 'expo-av';

type AudioContextType = {
  playSound: (trackName: any) => Promise<void>;
  stopSound: () => Promise<void>;
  toggleMute: () => Promise<void>;
  isMuted: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);
 
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = async (trackName: any) => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        trackName,
        { 
          isLooping: true, 
          volume: isMuted ? 0 : 1
        }
      )
      soundRef.current = sound;
      await sound.playAsync();
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(newMuted ? 0 : 1);
    }
  };

  const value = {
    playSound,
    stopSound,
    isMuted,
    toggleMute
  };

  return (
    <AudioContext.Provider value={ value }>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
