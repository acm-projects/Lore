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
import { useLobby } from '~/context/LobbyContext';
import Avatar from './Avatar';

// Type definitions for the component props
type PlotPointButtonProps = {
  /**
   * User avatar image source (URI or require)
   */
  /**
   * The plot point text content
   */
  plotPoint: string;

  /**
   * Number of votes
   */

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
  plotPoint,
  isSelected = false,
  onPress,
  style,
}) => {
  const { setLobbyCode, players, setPlayers, setCreator } = useLobby();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full h-16 flex-row items-center rounded-lg p-2 ${isSelected ? 'bg-secondary' : 'bg-primary'} ${style}`}
      activeOpacity={0.7}>

      {/* Plot Point */}
      <View className="flex-1 flex-row px-3 items-center">
          {/* players.map((player, index) => (
            <Image source={{ uri: player.avatar }} 
            className="w-10 h-10 rounded-full mr-2">
            </Image>
          )) */
          }

        <Text
          style={{ fontFamily: 'JetBrainsMonoBold' }}
          className={`text-lg text-primaryText`}
          numberOfLines={0}>
          {plotPoint}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlotPointButton;
