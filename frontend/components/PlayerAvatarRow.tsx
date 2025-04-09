import React, { useMemo } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import { PlayersWaiting } from '~/app/(game)/(play)/new-waiting';

const PlayerAvatarRow = ({
  players,
  maxAvatarSize = 50,
  minAvatarSize = 30,
}: {
  players: PlayersWaiting[];
  maxAvatarSize?: number;
  minAvatarSize?: number;
}) => {
  // Get screen width
  const screenWidth = Dimensions.get('window').width;
  // Calculate max container width (3/4 of screen width)
  const maxContainerWidth = screenWidth * 0.55;

  const { avatarSize, totalWidth } = useMemo(() => {
    if (!players || players.length === 0) {
      return { avatarSize: maxAvatarSize, totalWidth: 0 };
    }

    // Account for the space between avatars (mx-1 = 8px total per avatar)
    const spacing = 8;
    const totalSpacing = spacing * players.length;

    // Calculate available width for avatars
    const availableWidth = maxContainerWidth - totalSpacing;
    const calculatedAvatarSize = availableWidth / players.length;

    // Ensure size is within min and max bounds
    const finalAvatarSize = Math.max(minAvatarSize, Math.min(maxAvatarSize, calculatedAvatarSize));

    // Calculate the actual total width that will be used
    const totalWidth = finalAvatarSize * players.length + totalSpacing;

    return { avatarSize: finalAvatarSize, totalWidth };
  }, [players, maxAvatarSize, minAvatarSize, maxContainerWidth]);

  const borderWidth = Math.max(2, avatarSize * 0.08);

  if (!players || players.length === 0) {
    return null;
  }

  return (
    <View
      className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2"
      style={{ width: totalWidth }}>
      <View className="flex flex-row justify-center">
        {players.map((player, index) => (
          <View key={player.id || index} className="mx-1 items-center">
            <View
              className={`${player.finished ? 'border-green-500' : 'border-gray-300'}`}
              style={{
                borderWidth: borderWidth,
                borderRadius: avatarSize + borderWidth * 2,
                padding: 2,
              }}>
              <Image
                source={{ uri: `https://avatar.iran.liara.run/public/${player.id || index}` }}
                className="rounded-full"
                style={{ width: avatarSize, height: avatarSize }}
              />
            </View>
            {avatarSize >= 40 && (
              <Text
                className="mt-1 text-center text-xs"
                numberOfLines={1}
                style={{ maxWidth: avatarSize * 1.2 }}>
                {player.id}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default PlayerAvatarRow;
