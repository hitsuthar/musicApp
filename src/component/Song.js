import { TouchableOpacity, View, Image, Text } from "react-native";
import TrackPlayer from "react-native-track-player";
const Song = ({ item, isCurrent, index }) => {
  const { title, uri, artist, duration, filename } = item;
  return (
    <TouchableOpacity
      style={{
        borderWidth: 0.5,
        flexDirection: "row",
        padding: 2,
        // borderRadius: 10,
        justifyContent: "space-between",
      }}
      onPress={() => {
        TrackPlayer.skip(index);
        TrackPlayer.play();
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{
            uri: `data:image/png;base64,${item.artwork}`,
          }}
          style={{ height: 90, width: 90, borderRadius: 10 }}
        />
        <View style={{ paddingHorizontal: 5 }}>
          <Text style={{ fontWeight: "bold" }}>{title ? title : filename}</Text>
          <Text>{artist ? artist : "Unknown"}</Text>
          <Text>{isCurrent ? "playing" : index}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Song;
