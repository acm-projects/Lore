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
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-lg p-2 ${isSelected ? 'bg-secondary' : 'bg-primary'} ${style}`}
      activeOpacity={0.7}>
      <View className="h-10 w-10 overflow-hidden rounded-lg border-2 border-white">
      </View>

      {/* Plot Point */}
      <View className="flex-1 px-3">
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
