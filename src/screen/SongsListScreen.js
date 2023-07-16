import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Song from "../component/Song";
// import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
  usePlaybackState,
} from "react-native-track-player";
import Footer from "../component/Footer";

const SongsListScreen = () => {
  const [Queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);

  const playlist = async () => {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  };

  useEffect(() => {
    playlist();
  }, []);
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.state == State.nextTrack) {
      let index = await TrackPlayer.getCurrentTrack();
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
      <Footer />
    </View>
  );
};
export default SongsListScreen;
