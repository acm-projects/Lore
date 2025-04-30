import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

export type Players = {
  avatar: string;
  plotPoints: number;
  username?: string;
};

const LeaderboardComponent = ({ players }: { players: Players[] }) => {
  // Sort players by plot points in descending order
  const sortedPlayers = [...players].sort((a, b) => b.plotPoints - a.plotPoints);

  // Determine the maximum plot points for scaling
  const maxPoints = Math.max(...sortedPlayers.map((player) => player.plotPoints), 1); // Avoid division by zero

  const screenWidth = Dimensions.get('window').width;
  const barWidth = Math.floor((screenWidth - 80) / sortedPlayers.length);

  return (
    <View className="mt-14 flex justify-end p-5">
      <View className="h-72 flex-row items-end justify-evenly">
        {sortedPlayers.map((player, index) => {
          const barHeight = Math.floor((player.plotPoints / maxPoints));

          let barColorClass = 'bg-emerald-200';
          if (index === 0) barColorClass = 'bg-emerald-400';
          else if (index === 1) barColorClass = 'bg-emerald-500';

          return (
            <View key={index} className="items-center justify-end">
              {/* Avatar */}
              <View className="absolute -top-8 z-10">
                <Image
                  source={{ uri: player.avatar || 'https://placehold.co/100x100?text=No+Image' }}
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

              {/* Username */}
              <Text className="mt-2 w-[70px] text-center text-xs text-white" numberOfLines={1}>
                {player.username || 'Player'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default LeaderboardComponent;
