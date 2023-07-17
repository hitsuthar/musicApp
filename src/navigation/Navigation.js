import { NavigationContainer, StackActions } from "@react-navigation/native";
import SongsListScreen from "../screen/SongsListScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NowPlayingScreen from "../screen/NowPlayingScreen";
import { GetAllSongs } from "../utils/GetSongsDetails";
import { setupPlayer, addTracks } from "../utils/trackPlayerServices";
import TrackPlayer from "react-native-track-player";
import { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();
const Navigation = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const setup = async () => {
    const assets = await GetAllSongs();
    let isSetup = await setupPlayer();
    const Queue = await TrackPlayer.getQueue();
    if (isSetup && Queue.length <= 0) {
      await addTracks(assets);
    }
    setIsPlayerReady(isSetup);
  };
  useEffect(() => {
    setup();
  }, []);
  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AllSongs">
        <Stack.Screen name="AllSongs" component={SongsListScreen} />
        <Stack.Screen name="NowPlaying" component={NowPlayingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
