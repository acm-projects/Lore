import React, { useEffect, useRef, useState } from 'react';
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
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Touchable,
} from 'react-native'

const Playground = () => {
    // For drawing
    const [paths, setPaths] = useState<string[]>([]) 
    const [currentPath, setCurrentPath] = useState<string[]>([])

    // For undoing
    const [pathLengths, setPathLengths] = useState<string[]>([])

    // For redoing
    const [canvasHistory, setCanvasHistory] = useState<string[][]>([])
    const [historyIndex, setHistoryIndex] = useState(canvasHistory.length-1)
    //const [savedPaths, setSavedPaths] = useState<string[]>([])
    //const [savedPathLengths, setSavedPathLengths] = useState<string[]>([])
    
    const [isClearButtonClicked, setClearButtonClicked] = useState(false)

    const [strokeColor, setStrokeColor] = useState("black")

    const handleCanvasSave = () => {
        canvasHistory.push(paths)
        if(canvasHistory.length > 15) { // A total of 15 canvas states will be saved 
            canvasHistory.shift()
        }
        setCanvasHistory(canvasHistory)
        setHistoryIndex(canvasHistory.length-1)
    }

    const handleClear = () => {
        
        handleCanvasSave()

        setPaths([])
        setCurrentPath([])

        //setSavedPathLengths([])
        //setSavedPaths([])

        setClearButtonClicked(true)
    }

    const onTouchEnd = () => {
        paths.push(...currentPath)
        pathLengths.push((currentPath.length).toString())
        setCurrentPath([])
        setClearButtonClicked(false)
    }

    const onTouchMove = (event: any) => {
        const newPath = [...currentPath]
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;

        const newPoint = `${newPath.length === 0 ? 'M' : ''} ${locationX.toFixed(0)}, ${locationY.toFixed(0)} `
        newPath.push(newPoint)
        setCurrentPath(newPath)
    }

    const undoMove = () => {

        isClearButtonClicked ? setPaths(canvasHistory[canvasHistory.length-1]) : console.log()

        const newPathLengths = ([]) // Empty newPathLengths to prevent duplicates

        // Uses the pathLengths to get the number of svg paths in paths variable, then cuts off that # of elements to "undo" a stroke
        // Also puts it in savedPaths in order to be able to be redone. 
        paths.splice(-Number(pathLengths[pathLengths.length-1]), Number(pathLengths[pathLengths.length-1]))
        //savedPathLengths.push(pathLengths[pathLengths.length-1])

        for(let i = 0; i < pathLengths.length-1; i++) // Will loop through all pathLength elements except the last one because 
                                                      // that's the stroke that was deleted
        {
            pathLengths[i] == "0" ? console.log() : newPathLengths.push(pathLengths[i]) // After undoing, get all relevant pathLengths
        }                                                                               // because there will be some useless elements in pathLengths
        
        setPathLengths(newPathLengths) // Put all the useful stuff back into pathLengths
        
    }

    const redoMove = () => {
       /*  const newSavePathLengths = ([])
        const newSavedPaths = ([])

        console.log(savedPaths)
        console.log(savedPathLengths)

        for(let j = 0; j < Number(savedPathLengths[0]); j++)
        {
            paths.push(savedPaths[j])
        }

        for(let i = Number(savedPathLengths[0]); i < savedPaths.length; i++)
        {
            savedPaths[i] == "0" ? console.log() : newSavedPaths.push(savedPaths[i])
        }

        for(let k = 1; k < savedPathLengths.length; k++)
        {
            savedPathLengths[k] == "0" ? console.log() : newSavePathLengths.push(savedPathLengths[k])
        }
        
        setSavedPaths(newSavedPaths) 
        setSavedPathLengths(newSavePathLengths) */
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="bg-white h-1/2" onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Svg>
                    <Path
                        d={paths.join('')}
                        stroke={'red'}
                        fill={'transparent'}
                        strokeWidth={3}
                        strokeLinejoin={'round'}
                        strokeLinecap={'round'}/>
                    {paths.map((item, index) => (
                        <Path
                            key={`path-${index}`}
                            d={currentPath.join('')}
                            stroke={'red'}
                            fill={'transparent'}
                            strokeWidth={3}
                            strokeLinejoin={'round'}
                            strokeLinecap={'round'}/>
                    ))}
                </Svg>


            </View>
            <View className="flex-1 flex flex-col">

                <View className="flex-1 justify-between flex flex-row">

                    <TouchableOpacity className="bg-black w-[50px] h-[50px]" onPress={() => {handleClear()}}/>
                    <TouchableOpacity className="bg-white w-[50px] h-[50px]" onPress={() => {undoMove()}}/>

                <TouchableOpacity className="bg-red-500 w-[50px] h-[50px]" onPress={() => {redoMove()}}/>
                <TouchableOpacity className="bg-blue-500 w-[50px] h-[50px]" onPress={() => {undoMove()}}/>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default Playground