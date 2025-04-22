import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { useLocalSearchParams } from 'expo-router';
import { socket } from '~/socket';
import { Audio } from 'expo-av';
import { useAudio } from '~/context/AudioContext';
import MuteButton from '~/components/MuteButton';

const AIGen = () => {
  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  useFocusEffect( // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if(!isMuted){
        playSound(require('assets/ai-track.mp3'));
      }
      return() => {
        stopSound();
      }
    }, [isMuted]
  ))
  const clickSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/click.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }
  const { lobbyCode, addPlotPoint } = useLobby();
  const { prompt, story: initialStory, round, lastRound } = useLocalSearchParams();
  const router = useRouter();

  const [story, setStory] = useState<string>(''); // Displayed with typing effect
  const [fullStory, setFullStory] = useState<string>(''); // Full text to type out
  const [continueCount, setContinueCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);
  const [hasPressedContinue, setHasPressedContinue] = useState(false);
  const [isLoading, setIsLoading] = useState(story === 'Loading...');

  const [winnerAvatar, setWinnerAvatar] = useState('');

  const roundNumber = parseInt(round as string, 10);
  const lastRoundNumber = parseInt(lastRound as string, 10);
  const isFinalRound = roundNumber >= lastRoundNumber;

  useEffect(() => {
    socket.emit('request_continue_count', lobbyCode);

    socket.on('update_continue_count', ({ count, total }) => {
      setContinueCount(count);
      setTotalPlayers(total);
    });

    socket.on('go_to_prompt', () => {
      router.replace('/(game)/(play)/write');
    });

    socket.on('go_to_end', () => {
      router.replace('/(game)/(play)/summary');
    });

    socket.on(
      'story_ready',
      ({ prompt: finalPrompt, story: finalStory, winnerUsername, winnerAvatar }) => {
        console.log('✅ AI story received');
        setFullStory(finalStory);
        setStory('');
        setIsLoading(false);

        let index = 0;
        const typingSpeed = 15; // Milliseconds between characters

          const typeInterval = setInterval(() => {
            setStory((prev) => {
              const nextChar = finalStory[index];
              index++;
          
              // Auto scroll after character is added
              setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }, 0);
          
              if (index >= finalStory.length) {
                clearInterval(typeInterval);
              }
          
              return prev + nextChar;
            });
          }, typingSpeed);          

        setWinnerAvatar(winnerAvatar);

        addPlotPoint({
          winningPlotPoint: finalPrompt,
          story: finalStory,
          username: winnerUsername,
          avatar_url: winnerAvatar,
        });
        console.log('✅ Added Plot Point:', {
          prompt: finalPrompt,
          story: finalStory,
          username: winnerUsername,
          avatar_url: winnerAvatar,
        });
      }
    );

    return () => {
      socket.off('update_continue_count');
      socket.off('go_to_prompt');
      socket.off('go_to_end');
      socket.off('story_ready');
    };
  }, [lobbyCode]);

  const handleContinue = () => {
    clickSFX();
    if (!hasPressedContinue) {
      setHasPressedContinue(true);
      socket.emit('continue_pressed', lobbyCode);
    }
  };

  return (
    <SafeAreaView className="max-h-full flex-1 bg-background">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg4.gif")}/> 
      
      <GameBar isAbsolute={false} headerText="The Plot Thickens!" />
      <View className="mt-4 flex h-full flex-1 items-center justify-around px-6">
        {/* Plot Point Winner */}
        <View className="flex w-full flex-row rounded-lg bg-backgroundAccent p-4">
          <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-white">
            <Image source={{ uri: winnerAvatar }} className="h-full w-full" resizeMode="cover" />
          </View>
          <View className="flex-1 px-3 justify-between flex-row">
            
            <Text style={{fontFamily: 'JetBrainsMonoBold'}}
                  className="text-lg font-bold text-backgroundAccentText" numberOfLines={0}>
              {prompt}
            </Text>
            <MuteButton/>
          </View>
        </View>

        {/* 📖 Story Box or Loading Spinner */}
        <ScrollView
          ref={scrollRef}
          className="w-full flex-1 rounded-bl-lg rounded-br-lg bg-gray-600 p-4"
          contentContainerStyle={{ paddingBottom: 60 }}>
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={{fontFamily: 'JetBrainsMonoBold'}} className="mt-4 text-lg text-white">Loading story...</Text>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: 'JetBrainsMonoBold',
                fontSize: 18,
                lineHeight: 28,
                color: 'white',
                textAlign: 'left',
              }}
              className="whitespace-pre-line"
            >
              {story.split('\n').map((para, idx) => (
                <Text key={idx}>{'     ' + para + '\n\n'}</Text>
              ))}
            </Text>
          )}
        </ScrollView>
        {/* ✅ Continue Button */}
        <View className="mt-4 flex-[0.2] flex-row items-center justify-center">
          <Image
            source={require('assets/reading animation.gif')}
            resizeMode="contain"
            className="h-32 w-32"
          />
          <View className="w-full flex-1">
            <Button
              title={`Continue (${continueCount}/${totalPlayers})`}
              bgVariant={hasPressedContinue ? 'secondary' : 'primary'}
              textVariant={hasPressedContinue ? 'secondary' : 'primary'}
              onPress={handleContinue}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AIGen;
