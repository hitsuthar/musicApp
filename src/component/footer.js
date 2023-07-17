import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { GetCurrentTrack, PlayerControls } from "../utils/GetSongsDetails";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Footer = ({ navigation }) => {
  const [CurrentTrackInfo, setCurrentTrackInfo] = useState(null);

  useEffect(() => {
    (async () => {
      setCurrentTrackInfo(await GetCurrentTrack());
    })();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.state == State.nextTrack) {
      setCurrentTrackInfo(await GetCurrentTrack());
    }
  });

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        // alignContent: "space-between",
        margin: 10,
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: "white",
        // alignSelf: "flex-end",
        // position: "absolute",
        // width: "90%",
        marginTop: -57,
      }}
      onPress={() => navigation.navigate("NowPlaying")}
    >
      <View style={{ flexDirection: "row" }}>
        {/* <Image
          source={{
            uri: `data:image/png;base64,${CurrentTrackInfo?.artwork}`,
          }}
          style={{ height: 90, width: 90, borderRadius: 10 }}
        /> */}
        <View>
          <Text>{CurrentTrackInfo?.title}</Text>
          <Text>{CurrentTrackInfo?.artist}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <PlayerControls />
        <TouchableOpacity
          onPress={() => TrackPlayer.skipToNext()}
          style={styles.button}
        >
          <Image
            source={require("../../res/next.png")}
            style={{ height: 32, width: 32 }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 3,
  },
});
export default Footer;
