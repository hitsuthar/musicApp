import { FlatList, ScrollView, View } from "react-native";
import Song from "../component/Song";
import { useEffect, useState } from "react";
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Footer from "../component/Footer";

const SongsListScreen = ({ navigation }) => {
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 75 }}>
        {Queue?.map((item, index) => (
          <Song
            item={item}
            index={index}
            key={index}
            isCurrent={currentTrack == index}
          />
        ))}
      </ScrollView>
      {/* <View
        style={{
          alignSelf: "flex-end",
          position: "absolute",
          backgroundColor: "red",
          // width: "100%",
        }}
      > */}
      <Footer navigation={navigation} />
      {/* </View> */}
    </View>
  );
};
export default SongsListScreen;
