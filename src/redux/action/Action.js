import MediaMeta from "react-native-media-meta";
import GetAllSongs from "../../utils/GetSongsDetails";

export const setMusicAssets = () => async (dispatch) => {
  const assets = await GetAllSongs();
  let temp = [];
  await Promise.all(
    assets.map(async (songAssets) => {
      temp.push(
        await MediaMeta.get(songAssets.url?.replace("file://", "")).then(
          (meta) => {
            meta["artwork"] = meta["thumb"];
            delete meta.thumb;
            delete meta.comment;
            delete meta.composer;
            delete meta.encoder;
            delete meta.height;
            delete meta.width;

            meta.duration = parseInt(meta.duration / 1000);
            // meta.artwork = [{ uri: `data:image/png;base64,${meta.artwork}` }];
            return Object.assign(meta, songAssets);
          }
        )
      );
    })
  );

  // console.log(
  //   "🚀 ~ file: Action.js:34 ~ setMusicAssets ~ temp:",
  //   temp
  //     .sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0))
  //     .map(({ artwork, ...rest }) => {
  //       return rest;
  //     })
  // );

  dispatch({
    type: "SET_MUSIC_ASSETS",
    payload: {
      assets: temp.sort((a, b) =>
        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
      ),
    },
  });
  return temp.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
};
