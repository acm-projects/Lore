import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  runOnJS,
} from 'react-native-reanimated';
import { Svg, Path, G, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const WHEEL_DIAMETER = 300;
const WHEEL_RADIUS = WHEEL_DIAMETER / 2;

interface LuckyWheelProps {
  items: string[];
  winner?: string;
  isVisible?: boolean;
  onSpinComplete?: (result: string) => void;
  spins?: number;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({
  items,
  winner,
  isVisible = false,
  onSpinComplete,
  spins,
}) => {
  // Animation values
  const rotationValue = useSharedValue(0);
  const wheelPositionX = useSharedValue(-SCREEN_WIDTH);
  const wheelPositionY = useSharedValue(SCREEN_HEIGHT);

  // State
  const [isSpinning, setIsSpinning] = useState(false);

  // Wheel sector calculations
  const sectorAngle = 360 / items.length;

  useEffect(() => {
    spinWheel();
  }, [spins]);

  // Spin the wheel
  const spinWheel = () => {
    // Prevent multiple spins
    if (isSpinning) return;

    setIsSpinning(true);

    // Determine winning angle based on provided winner
    const winnerIndex = winner ? items.indexOf(winner) : Math.floor(Math.random() * items.length);
    console.log(winnerIndex);

    // Calculate target rotation with multiple full spins and precision
    const targetRotation =
      360 * (4 + Math.random() * 2) + // Multiple full spins
      winnerIndex * sectorAngle + // Align to winner
      Math.random() * sectorAngle; // Random position within sector

    rotationValue.value = withDecay(
      {
        velocity: 500,
        deceleration: 0.997,
      },
      (finished) => {
        if (finished) {
          rotationValue.value = withSpring(targetRotation, {
            damping: 10,
            stiffness: 40,
            mass: 1,
          });

          runOnJS(setIsSpinning)(false);
          if (onSpinComplete) {
            runOnJS(onSpinComplete)(items[winnerIndex]);
          }
        }
      }
    );
  };

  // Update wheel position when isVisible changes
  React.useEffect(() => {
    if (isVisible) {
      // Animate from left side
      wheelPositionX.value = withSpring(SCREEN_WIDTH / 2.5 - WHEEL_RADIUS, {
        damping: 12,
        stiffness: 100,
        mass: 1,
      });
      wheelPositionY.value = withSpring(SCREEN_HEIGHT / 6 - WHEEL_RADIUS, {
        damping: 12,
        stiffness: 100,
        mass: 1,
      });
    } else {
      // Move off-screen to the left
      wheelPositionX.value = withSpring(-SCREEN_WIDTH, { damping: 12, stiffness: 100, mass: 1 });
      wheelPositionY.value = withSpring(SCREEN_HEIGHT, { damping: 12, stiffness: 100, mass: 1 });
    }
  }, [isVisible]);

  // Animated styles
  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: wheelPositionX.value },
      { translateY: wheelPositionY.value },
      { rotate: `${rotationValue.value}deg` },
    ],
  }));

  // Render wheel sectors
  const renderWheelSectors = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E', '#6C5CE7', '#FF8A5B'];

    return items.map((item, index) => {
      const startAngle = index * sectorAngle;
      const endAngle = (index + 1) * sectorAngle;

      const x1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos((startAngle * Math.PI) / 180);
      const y1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin((startAngle * Math.PI) / 180);
      const x2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos((endAngle * Math.PI) / 180);
      const y2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin((endAngle * Math.PI) / 180);

      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

      const pathData = `
          M${WHEEL_RADIUS},${WHEEL_RADIUS} 
          L${x1},${y1} 
          A${WHEEL_RADIUS},${WHEEL_RADIUS} 0 ${largeArcFlag},1 ${x2},${y2}Z
        `;

      // Calculate text position
      const midAngle = (startAngle + endAngle) / 2;
      const textRadius = WHEEL_RADIUS * 0.7; // Place text inside the sector
      const textX = WHEEL_RADIUS + textRadius * Math.cos((midAngle * Math.PI) / 180);
      const textY = WHEEL_RADIUS + textRadius * Math.sin((midAngle * Math.PI) / 180);

      return (
        <G key={index}>
          <Path d={pathData} fill={colors[index % colors.length]} />
          <SvgText
            x={textX}
            y={textY}
            fontSize="12"
            textAnchor="middle"
            rotation={midAngle + 90}
            originX={textX}
            originY={textY}
            fill="white">
            {item}
          </SvgText>
        </G>
      );
    });
  };

  // Only render if component is visible or animating
  if (!isVisible && wheelPositionX.value <= -SCREEN_WIDTH) {
    return null;
  }

  return (
    <View className="pointer-events-none absolute inset-0 z-50 items-center justify-center">
      {/* Stationary Pointer */}
      <View
        className="absolute z-50 h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-red-500 border-l-transparent border-r-transparent"
        style={{
          position: 'absolute',
          top: SCREEN_HEIGHT / 2 - WHEEL_RADIUS - 15,
          left: SCREEN_WIDTH / 2 - 20,
          zIndex: 100,
        }}
      />

      <Animated.View
        className="absolute z-50"
        style={[
          {
            width: WHEEL_DIAMETER,
            height: WHEEL_DIAMETER,
            position: 'absolute',
            top: SCREEN_HEIGHT / 2 - WHEEL_RADIUS,
            left: SCREEN_WIDTH / 2 - WHEEL_RADIUS,
          },
          wheelAnimatedStyle,
        ]}>
        <Svg
          width={WHEEL_DIAMETER}
          height={WHEEL_DIAMETER}
          viewBox={`0 0 ${WHEEL_DIAMETER} ${WHEEL_DIAMETER}`}>
          {renderWheelSectors()}
        </Svg>
      </Animated.View>

      <TouchableOpacity
        className={`pointer-events-auto absolute bottom-10 z-50 rounded-full px-6 py-3 ${isSpinning ? 'bg-gray-400' : 'bg-green-500'}`}
        onPress={spinWheel}
        disabled={isSpinning}>
        <Text className="font-bold text-white">{isSpinning ? 'Spinning...' : 'Spin'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LuckyWheel;
