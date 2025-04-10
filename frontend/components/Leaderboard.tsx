import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

export type Players = {
  avatar: string;
  plotPoints: number;
};

const LeaderboardComponent = ({ players }: { players: Players[] }) => {
  // Sort players by plot points in descending order
  const sortedPlayers = [...players].sort((a, b) => b.plotPoints - a.plotPoints);

  // Determine the maximum plot points for scaling
  const maxPoints = Math.max(...sortedPlayers.map((player) => player.plotPoints));

  // Calculate the width of each bar based on the number of players
  const screenWidth = Dimensions.get('window').width;
  const barWidth = Math.floor((screenWidth - 80) / sortedPlayers.length);

  return (
    <View className="mt-14 flex justify-end p-5">
      {/* Bars and Avatars */}
      <View className="h-72 flex-row items-end justify-evenly">
        {sortedPlayers.map((player, index) => {
          // Calculate height based on points relative to the maximum
          const barHeight = Math.floor((player.plotPoints / maxPoints) * 200);

          // Determine bar color based on position
          let barColorClass = 'bg-emerald-200'; // 3rd place
          if (index === 0) {
            barColorClass = 'bg-emerald-400'; // 1st place
          } else if (index === 1) {
            barColorClass = 'bg-emerald-500'; // 2nd place
          }

          return (
            <View key={index} className="items-center justify-end">
              {/* Avatar */}
              <View className="absolute -top-8 z-10">
                <Image
                  source={{ uri: 'https://picsum.photos/200/200' }}
                  className="h-16 w-16 rounded-full border-2 border-white"
                  resizeMode="cover"
                />
              </View>

              {/* Bar */}
              <View
                className={`rounded-t-md ${barColorClass}`}
                style={{
                  height: barHeight,
                  width: barWidth,
                }}
              />

              {/* Plot Points Text */}
              <View className="absolute -top-24 items-center">
                <Text className="text-3xl font-bold text-white">{player.plotPoints}</Text>
                <Text className="text-sm text-white">Plot Points</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default LeaderboardComponent;
