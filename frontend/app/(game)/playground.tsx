import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import data from '~/data/data.json'
import { Asset } from 'expo-asset';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import {Svg, Path} from 'react-native-svg'
import { Bomb, Redo, Undo, Palette, BoomBox, Pen } from 'lucide-react-native';
import Slider from '@react-native-community/slider'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  useAnimatedValue,
} from 'react-native'
import { router, useFocusEffect } from 'expo-router';

const Playground = () => {

    useFocusEffect( useCallback(() => { 
        setUndoStack([])
        setRedoStack([])
        setPaths([])
        setCurrentPath([])
    }, []))
    
    // ------------------------------- Drawing -------------------------------------------------
    type PathPoint = { d: string; color: string; strokeWidth: number };
    
    const [paths, setPaths] = useState<PathPoint[]>([]) 
    const [currentPath, setCurrentPath] = useState<PathPoint[]>([])
    
    const [undoStack, setUndoStack] = useState<PathPoint[][]>([]);
    const [redoStack, setRedoStack] = useState<PathPoint[][]>([]);
    
    const [strokeColor, setStrokeColor] = useState("black")
    const [strokeWidth, setStrokeWidth] = useState(3)


    const handleClear = () => {
        if(paths.length === 0) {
            return;
        }

        setPaths([])
        setCurrentPath([])

        setUndoStack((prevUndoStack) => [...prevUndoStack, [{d: paths.map(point => point.d).join(' '), 
                                                            color: paths.map(point => point.color)?.at(paths.length-1)+"",
                                                            strokeWidth: strokeWidth}, 
                                                            {d: currentPath.map(point => point.d).join(' '), 
                                                            color: currentPath.map(point => point.color)?.at(paths.length-1)+"",
                                                            strokeWidth: strokeWidth}]])
        setRedoStack([])
    }

    const onTouchEnd = () => {        
        if (currentPath.length === 0) return;

        if (paths.length === 0) {
            setPaths(() => [{
                d: currentPath.map(point => point.d).join(' '), // Combine points into one path
                color: strokeColor,
                strokeWidth: strokeWidth
            }])
        } else {
            setPaths((prevPaths) => [
                ...prevPaths,
                {
                    d: currentPath.map(point => point.d).join(' '), // Combine points into one path
                    color: strokeColor,
                    strokeWidth: strokeWidth
                }
            ])  
        }
        // IDEA : CREATE SEPERATE STACKS FOR EACH ATTRIBUTE, LIKE D COLOR, STROKEWIDTH
        setCurrentPath([])
        setUndoStack((prevUndoStack) => [...prevUndoStack, [{d: paths.map(point => point.d).join(' '), 
                                                             color: paths.map(point => point.color)?.at(paths.length-1)+"",
                                                             strokeWidth: strokeWidth}, 
                                                            {d: currentPath.map(point => point.d).join(' '), 
                                                             color: currentPath.map(point => point.color)?.at(paths.length-1)+"",
                                                             strokeWidth: strokeWidth}]])
        setRedoStack([])
    }

    const onTouchMove = (event: any) => {
        const newPath = [...currentPath]
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = 
        {
            d: `${newPath.length === 0 ? 'M' : 'L'} ${locationX.toFixed(0)}, ${locationY.toFixed(0)}`,
            color: strokeColor,
            strokeWidth: strokeWidth
        }
        newPath.push(newPoint)
        setCurrentPath(newPath)
    }

    const undoMove = () => {

        if(undoStack.length > 1) {            
            const previousPaths = undoStack[undoStack.length-2] // Has to be -2 because if length is 1 or 0, it'll be index out of bounds
            const lastPath = undoStack[undoStack.length -1] // Used to put into redo Stack

            console.log(undoStack)
            for(let i = 0; i <= previousPaths.length; i++)
            {
                previousPaths.map(item => {if(item.d.length == 0) {
                    previousPaths.splice(i, 1)
                }})
            }

            setRedoStack(prevRedoStack => [...prevRedoStack, lastPath])
            setUndoStack(prevUndoStack => prevUndoStack.slice(0, -1))
            setPaths(previousPaths)

        } else if(undoStack.length == 1) {
            const lastPath = undoStack[undoStack.length -1]
            
            setRedoStack(prevRedoStack => [...prevRedoStack, lastPath])
            setUndoStack([])
            setPaths([])
        }
    }
    
    const redoMove = () => {
        if (redoStack.length > 0) {
            const nextPaths = redoStack[redoStack.length - 1]; // Use the 
            setUndoStack(prevUndoStack => [...prevUndoStack, nextPaths]); 
            setRedoStack(prevRedoStack => prevRedoStack.slice(0, -1)); // Removes the last index of RedoStack
            setPaths(nextPaths);
        }
    }
// ---------------------------------------------------------------------------------------------------------

// ----------------------------------- Color Picker --------------------------------------------------------
    const slideValue = useRef(useAnimatedValue(0)).current
    const containerWidth = useRef(0); // To store the initial width of the container
    const [isColorPickerVisible, setColorPickerVisible] = useState(false)

    const onLayoutColor = (event: any) => {
        containerWidth.current = event.nativeEvent.layout.width;
    };

    const colorPickerSlideInAnimation = () => {
        setColorPickerVisible(false)
        Animated.timing(slideValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start()
    }

    const colorPickerSlideOutAnimation = () => {
        setColorPickerVisible(true)
        Animated.timing(slideValue, {
            toValue: -5,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }

    const changeStrokeColor = (color: string) => {
        setStrokeColor(color)
    }
// ---------------------------------------------------------------------------------------------------------

// ----------------------------------- Width Slider --------------------------------------------------------
const [isWidthSliderVisible, setWidthSliderVisible] = useState(false)

    const onLayoutWidth = (event: any) => {
        containerWidth.current = event.nativeEvent.layout.width;
    };

    const changeStrokeWidth = (width: number) => {
        setStrokeWidth(width)
    }

    const widthSliderSlideInAnimation = () => {
        setWidthSliderVisible(false)
        Animated.timing(slideValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start()
    }

    const widthSliderSlideOutAnimation = () => {
        setWidthSliderVisible(true)
        Animated.timing(slideValue, {
            toValue: -5,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="bg-white h-1/2" onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Svg>
                    {paths.map((item, index) => (
                        <Path
                            key={`path-${index}`}
                            d={item.d}
                            stroke={item.color}
                            fill={'transparent'}
                            strokeWidth={item.strokeWidth}
                            strokeLinejoin={'round'}
                            strokeLinecap={'round'}/>
                    ))}
                    <Path
                        d={currentPath.map(point => point.d).join(' ')}
                        stroke={strokeColor}
                        fill={'transparent'}
                        strokeWidth={3}
                        strokeLinejoin={'round'}
                        strokeLinecap={'round'}/>
                </Svg>
            </View>
            <View className="flex-1 flex flex-col">
                <View className="m-6 flex-1 justify-between flex flex-row">
                    <Bomb size={40} color="black" onPress={() => {handleClear()}}/>
                    <Undo size={40} color="black" onPress={() => {undoMove()}}/>
                    <Redo size={40} color="black" onPress={() => {redoMove()}}/>
                    <Pen size={40} color="black" onPress={() => {isWidthSliderVisible ? widthSliderSlideInAnimation : widthSliderSlideOutAnimation}}/>
                    <TouchableOpacity className="rounded-full w-[40px] h-[40px]" style={{backgroundColor: strokeColor}} onPress={() => {isColorPickerVisible ? colorPickerSlideInAnimation() : colorPickerSlideOutAnimation()}}/>
                </View>

                {/* Interpolate will force the width to be 0, meaning that the left side will expand only*/}
                <Animated.View style={{transform: [{scaleX: slideValue}], 
                                       width: slideValue.interpolate({inputRange: [0, 10], outputRange: [0, 0]}), 
                                       position: 'absolute', marginLeft: 310}} 
                                       onLayout={onLayoutColor}>
                    <View className="bg-secondaryText w-[10px] h-[300px] rounded-sm ">
                        <View className="flex-1 flex-col items-center justify-between py-4">

                        <TouchableOpacity className="bg-black w-[7px] h-[30px]" onPress={() => changeStrokeColor('black')}/>
                        <TouchableOpacity className="bg-white w-[7px] h-[30px] " onPress={() => changeStrokeColor('white')}/>
                        <TouchableOpacity className="bg-red-600 w-[7px] h-[30px] " onPress={() => changeStrokeColor('red')}/>
                        </View>

                    </View>
                </Animated.View>
                <TouchableOpacity className="h-[50px] w-[50px] bg-blue-500" onPress={() => router.push('/(game)/(play)/voting')}>

                </TouchableOpacity>
                <TouchableOpacity className="h-[50px] w-[50px] bg-red-500" onPress={() => router.push('/(game)/(play)/score-page')}>

</TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Playground