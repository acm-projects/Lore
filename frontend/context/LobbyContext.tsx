import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

type PlotPoint = {
  winningPlotPoint: string;
  story: string;
};

// Define the shape of our context state
type LobbyContextType = {
  lobbyCode: string;
  plotPoints: PlotPoint[];
  isVisible: boolean;
  toggleVisible: () => void;
  players: { id: string }[];
  creatorId: string | null;
  setCreator: (id: string) => void;
  setPlayers: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
  addPlayer: (player: string) => void;
  removePlayer: (player: string) => void;
  clearPlayers: () => void;
  setLobbyCode: (code: string) => void;
  setPlotPoints: (points: PlotPoint[]) => void;
  addPlotPoint: (plotPoint: PlotPoint) => void;
  removePlotPoint: (index: number) => void;
  clearPlotPoints: () => void;
};

// Create the context with a default value
const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

// Props for our context provider
type LobbyProviderProps = {
  children: ReactNode;
};

// Provider component
export const LobbyProvider = ({ children }: LobbyProviderProps) => {
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [players, setPlayers] = useState<{ id: string }[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const animationValue = useRef(new Animated.Value(0)).current;
  let [isVisible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!isVisible);
    Animated.timing(animationValue, {
      toValue: isVisible ? 0 : Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Helper function to set the creator ID
  const setCreator = (id: string) => {
    setCreatorId(id);
  };

  // Helper function to add a player
  const addPlayer = (player: string) => {
    setPlayers((prevPlayers) => [...prevPlayers, { id: player }]);
  };

  // Helper function to remove a player
  const removePlayer = (player: string) => {
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== player));
  };

  // Helper function to clear all players
  const clearPlayers = () => {
    setPlayers([]);
  };
  // Helper function to add a single plot point
  const addPlotPoint = (plotPoint: PlotPoint) => {
    setPlotPoints((prevPoints) => [...prevPoints, plotPoint]);
  };

  // Helper function to remove a plot point
  const removePlotPoint = (index: number) => {
    setPlotPoints((prevPoints) => prevPoints.filter((_, i) => i !== index));
  };

  // Helper function to clear all plot points
  const clearPlotPoints = () => {
    setPlotPoints([]);
  };

  // Value object that will be passed to consumers
  const value = {
    lobbyCode,
    plotPoints,
    isVisible,
    toggleVisible,
    players,
    setLobbyCode,
    setPlotPoints,
    creatorId,
    setPlayers,
    setCreator,
    addPlotPoint,
    removePlotPoint,
    clearPlotPoints,
    addPlayer,
    removePlayer,
    clearPlayers,
  };

  return <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>;
};

// Custom hook to use the context
export const useLobby = (): LobbyContextType => {
  const context = useContext(LobbyContext);
  if (context === undefined) {
    throw new Error('useLobby must be used within a LobbyProvider');
  }
  return context;
};
