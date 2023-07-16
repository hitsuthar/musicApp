const initialState = { assets: [] };

const songReducer = (state = initialState, { type, payload }) => {
  // console.log("payload = ", payload, "type = ", type);
  switch (type) {
    case "SET_MUSIC_ASSETS":
      return {
        ...state,
        assets: payload,
      };

    default:
      return state;
  }
};
export default songReducer;
