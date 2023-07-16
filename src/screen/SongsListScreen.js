import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Song from "../component/Song";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
  usePlaybackState,
} from "react-native-track-player";
import {
  GetCurrentTrack,
  PlayerControls,
  PlayPause,
} from "../utils/GetSongsDetails";

const SongsListScreen = () => {
  const [Queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [CurrentTrackInfo, setCurrentTrackInfo] = useState(null);
  const playerState = usePlaybackState();

  const playlist = async () => {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  };

  useEffect(() => {
    playlist();
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
    <View style={{ flex: 2 }}>
      <ScrollView>
        {Queue?.map((item, index) => (
          <Song
            item={item}
            index={index}
            key={index}
            isCurrent={currentTrack == index}
          />
        ))}
      </ScrollView>
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
          <TouchableOpacity>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default SongsListScreen;
