import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Type definitions for the component props
type PlotPointButtonProps = {
  /**
   * User avatar image source (URI or require)
   */
  avatar?: ImageSourcePropType;

  /**
   * The plot point text content
   */
  plotPoint: string;

  /**
   * Number of votes
   */
  votes: number;

  /**
   * Whether the button is selected
   */
  isSelected?: boolean;

  /**
   * Function called when button is pressed
   */
  onPress?: () => void;

  /**
   * Additional styles for the button container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Background color when selected (Tailwind class)
   */
  selectedColor?: string;

  /**
   * Default background color (Tailwind class)
   */
  defaultColor?: string;
};

const PlotPointButton: React.FC<PlotPointButtonProps> = ({
  avatar,
  plotPoint,
  votes,
  isSelected = false,
  onPress,
  style,
}) => {
  const avatarImage = require('~/assets/avatar1.png');

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-full p-2 ${isSelected ? 'bg-primary' : 'bg-secondary'} ${style}`}
      activeOpacity={0.7}>
      {/* Avatar */}
      <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-white">
        <Image
          //source={typeof avatar === 'string' ? { uri: avatar } : avatar}
          source={avatarImage}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Plot Point */}
      <View className="flex-1 px-3">
        <Text
          className={`${isSelected ? 'text-primaryText' : 'text-primaryText'} text-lg`}
          numberOfLines={0}>
          {plotPoint}
        </Text>
      </View>

      {/* Votes */}
      <View className="items-center justify-center">
        <Text
          className={`text-sm font-bold ${isSelected ? 'text-primaryText' : 'text-primaryText'}`}>
          Votes
        </Text>
        <Text
          className={`${isSelected ? 'text-primaryText' : 'text-secondaryText'} text-lg font-bold`}>
          {votes}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlotPointButton;
