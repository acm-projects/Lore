import React, { useEffect, useState } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet } from 'react-native';

// Using React Native's built-in Animated instead of Reanimated
// This avoids the complex hook usage that was causing problems

const AnimatedScoreboard = ({ data }) => {
  // Sort the initial data by past score
  const [players, setPlayers] = useState(() => {
    return [...data]
      .sort((a, b) => b.past_score - a.past_score)
      .map((player, index) => ({
        ...player,
        rank: index,
        // Create regular Animated values instead of hooks
        scoreAdditionAnim: new Animated.Value(1),
        currentScoreAnim: new Animated.Value(player.past_score),
        positionAnim: new Animated.Value(index * 80), // 80px per item
        currentDisplayScore: player.past_score,
      }));
  });

  // Start animations when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      animateScoreChanges();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // First animation: score changes
  const animateScoreChanges = () => {
    // Create animations for each player
    const animations = players.map((player) => {
      // Score addition fade out animation
      const scoreAdditionAnim = Animated.timing(player.scoreAdditionAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });

      // Current score increase animation
      const currentScoreAnim = Animated.timing(player.currentScoreAnim, {
        toValue: player.new_score,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // can't use native driver for non-transform/opacity
      });

      return Animated.parallel([scoreAdditionAnim, currentScoreAnim]);
    });

    // Execute all animations in parallel, then update rankings
    Animated.parallel(animations).start(() => {
      updateRankings();
    });

    // Set up listeners to update the displayed score during animation
    players.forEach((player) => {
      player.currentScoreAnim.addListener(({ value }) => {
        player.currentDisplayScore = Math.round(value);
        // Force a re-render to show updated score
        setPlayers([...players]);
      });
    });
  };

  // Second animation: ranking changes
  const updateRankings = () => {
    // Update scores to their new values
    const updatedPlayers = players.map((player) => ({
      ...player,
      past_score: player.new_score,
    }));

    // Sort by new scores
    const sortedPlayers = [...updatedPlayers].sort((a, b) => b.past_score - a.past_score);

    // Create animations for position changes
    const positionAnimations = sortedPlayers.map((player, newIndex) => {
      // Update rank property
      player.rank = newIndex;

      // Animate to new position
      return Animated.timing(player.positionAnim, {
        toValue: newIndex * 80, // 80px per item
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });
    });

    // Execute all position animations in parallel
    Animated.parallel(positionAnimations).start();

    // Update state with new player order
    setPlayers(sortedPlayers);
  };

  return (
    <View className="flex-1 bg-none p-4">
      <View className="relative flex-1" style={{ height: 80 * 10 }}>
        {players.map((player, index) => (
          <Animated.View
            key={player.username}
            className={`absolute mb-2 h-20 w-full flex-row items-center rounded-lg bg-backgroundAccent p-3 ${player.winner ? 'border-2 border-primary' : ''}`}
            style={{
              transform: [{ translateY: player.positionAnim }],
            }}>
            <Text className="w-8 text-center text-lg font-bold text-backgroundAccentText">
              {player.rank + 1}
            </Text>
            <Image
              source={{ uri: player.avatar_url }}
              className="mr-3 h-12 w-12 rounded-full"
              resizeMode="cover"
            />
            <Text className="flex-1 text-base font-medium text-backgroundAccentText">
              {player.username}
            </Text>

            <View className="min-w-24 flex-row items-center justify-end">
              <Text className="mr-1 text-lg font-bold text-backgroundAccentText">
                {player.currentDisplayScore}
              </Text>

              {player.score_to_add > 0 && (
                <Animated.View
                  className="rounded-full bg-green-500 px-3 py-1"
                  style={{
                    opacity: player.scoreAdditionAnim,
                    transform: [{ scale: player.scoreAdditionAnim }, { rotate: '-15deg' }],
                  }}>
                  <Text className="font-bold text-white">
                    +{Math.round(player.score_to_add * player.scoreAdditionAnim._value)}
                  </Text>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default AnimatedScoreboard;

// Example usage:
// const sampleData = [
//   { username: 'Player1', avatar_url: 'https://via.placeholder.com/50', past_score: 1200, score_to_add: 300, new_score: 1500 },
//   { username: 'Player2', avatar_url: 'https://via.placeholder.com/50', past_score: 1400, score_to_add: 50, new_score: 1450 },
//   { username: 'Player3', avatar_url: 'https://via.placeholder.com/50', past_score: 900, score_to_add: 600, new_score: 1500 },
//   { username: 'Player4', avatar_url: 'https://via.placeholder.com/50', past_score: 800, score_to_add: 200, new_score: 1000 },
//   { username: 'Player5', avatar_url: 'https://via.placeholder.com/50', past_score: 1100, score_to_add: 100, new_score: 1200 }
// ];
