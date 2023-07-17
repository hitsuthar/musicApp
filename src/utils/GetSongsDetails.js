import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import MediaMeta from "react-native-media-meta";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

const permissionPopUp = async () => {
  try {
    Alert.alert("permission required", [
      {
        text: "Accept",
        onPress: async () => {
          MediaLibrary.requestPermissionsAsync();
          await getPermission();
        },
      },
      { text: "Cancel", onPress: () => permissionPopUp() },
    ]);
  } catch (error) {
    console.log(error);
  }
};
const getPermission = async () => {
  try {
    const permission = await MediaLibrary.getPermissionsAsync();
    // console.log("permission = ", permission);
    if (permission.granted === false) {
      const newPermission = await MediaLibrary.requestPermissionsAsync();
      if (newPermission.status === "denied") {
        permissionPopUp();
      }
      if (
        newPermission.status === "denied" &&
        newPermission.canAskAgain === false
      ) {
        permissionPopUp();
      }
      if (newPermission.status === "granted") {
        console.log("permission granted");
        // GetAllSongs();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const GetAllSongs = async () => {
  await getPermission();
  const assets = await MediaLibrary.getAssetsAsync({
    mediaType: "audio",
  });

  let temp = [];
  await Promise.all(
    assets.assets.map(
      async ({
        albumId,
        creationTime,
        duration,
        height,
        id,
        mediaType,
        modificationTime,
        width,
        ...rest
      }) => {
        rest["url"] = rest["uri"];
        delete rest["uri"];

        temp.push(
          await MediaMeta.get(rest.url?.replace("file://", "")).then((meta) => {
            meta["artwork"] = meta["thumb"];
            delete meta.thumb;
            delete meta.comment;
            delete meta.composer;
            delete meta.encoder;
            delete meta.height;
            delete meta.width;
            meta.duration = parseInt(meta.duration / 1000);
            return Object.assign(meta, rest);
          })
        );
      }
    )
  );

  return temp.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
};

const GetCurrentTrack = async () => {
  const track = await TrackPlayer.getCurrentTrack();
  const info = await TrackPlayer.getTrack(track);
  return Object.assign(track, info);
};

const PlayerControls = () => {
  const playerState = usePlaybackState();
  const PlayPause = async () => {
    if (playerState == State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={PlayPause}>
        {playerState == State.Playing ? (
          <Image source={require("../../res/pause.png")} />
        ) : (
          <Image source={require("../../res/play.png")} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // borderWidth: 1,
    // borderRadius: 10,
    // padding: 5,
    margin: 3,
  },
});

export { GetAllSongs, GetCurrentTrack, PlayerControls };
