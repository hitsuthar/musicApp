import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { setupPlayer, addTracks } from "../utils/trackPlayerServices";
import { useEffect, useState } from "react";
import { PlayerControls, PlayPause } from "../utils/GetSongsDetails";

const NowPlayingScreen = ({ navigation }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { assets } = useSelector((state) => state.assets);

  useEffect(() => {
    const setup = async () => {
      let isSetup = await setupPlayer();
      const Queue = await TrackPlayer.getQueue();
      if (isSetup && Queue.length <= 0) {
        await addTracks({ assets });
      }
      setIsPlayerReady(isSetup);
    };
    setup();
  }, [assets]);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  const Progress = () => {
    const [IsSeeking, setIsSeeking] = useState(false);
    const [Seek, setSeek] = useState(0);
    const { position, duration } = useProgress(500);

    const format = (seconds) => {
      let minute = parseInt(seconds / 60)
        .toString()
        .padStart(2, "0");
      let second = (Math.trunc(seconds) % 60).toString().padStart(2, "0");
      return `${minute}:${second}`;
    };
    const change = (val) => {
      TrackPlayer.seekTo(val);
      TrackPlayer.play().then(() => {
        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      });
    };

    return (
      <>
        <Text>
          {format(position)} / {format(duration)}
        </Text>
        <Slider
          style={{ width: "90%" }}
          minimumValue={0}
          maximumValue={duration}
          value={IsSeeking ? Seek : position}
          onValueChange={(value) => {
            TrackPlayer.pause();
            setIsSeeking(true);
            setSeek(value);
            change(value);
          }}
        />
      </>
    );
  };

  const SongInfo = () => {
    const [Info, setInfo] = useState({});
    useEffect(() => {
      getSongInfo();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
      if (event.state == State.nextTrack) {
        getSongInfo();
      }
    });

    const getSongInfo = async () => {
      const track = await TrackPlayer.getCurrentTrack();
      const info = await TrackPlayer.getTrack(track);
      setInfo(info);
      return info;
    };

    return (
      <View style={{ alignItems: "center" }}>
        <Image
          style={{
            height: 300,
            width: 300,
            borderRadius: 20,
          }}
          source={{
            uri: `data:image/png;base64,${Info.artwork}`,
          }}
        />
        <Text style={{ paddingTop: 20, paddingBottom: 5, fontWeight: "bold" }}>
          {Info.title}
        </Text>
        <Text>{Info.artist}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ alignItems: "center", flex: 1, justifyContent: "space-evenly" }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require("../../res/arrow.png")} />
      </TouchableOpacity>
      <SongInfo />
      <Progress />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
          <Image source={require("../../res/previous.png")} />
        </TouchableOpacity>

        <PlayerControls />

        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <Image source={require("../../res/next.png")} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 200,
    padding: 5,
  },
});
export default NowPlayingScreen;
