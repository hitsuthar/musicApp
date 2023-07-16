import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { GetCurrentTrack, PlayerControls } from "../utils/GetSongsDetails";

const Footer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [CurrentTrackInfo, setCurrentTrackInfo] = useState(null);

  useEffect(() => {
    (async () => {
      setCurrentTrackInfo(await GetCurrentTrack());
    })();
    console.log(
      "🚀 ~ file: SongsListScreen.js:17 ~ SongsListScreen ~ CurrentTrackInfo:",
      CurrentTrackInfo
    );
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.state == State.nextTrack) {
      let index = await TrackPlayer.getCurrentTrack();
      setCurrentTrackInfo(await GetCurrentTrack());
      setCurrentTrack(index);
    }
  });
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{
            uri: `data:image/png;base64,${CurrentTrackInfo?.artwork}`,
          }}
          style={{ height: 90, width: 90, borderRadius: 10 }}
        />
        <View>
          <Text>{CurrentTrackInfo?.title}</Text>
          <Text>{CurrentTrackInfo?.artist}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <PlayerControls />
        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Footer;
