import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import store from "./src/redux/store/Store.js";
import { Provider, useDispatch } from "react-redux";
import Navigation from "./src/navigation/Navigation.js";
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar
          style="dark"
          backgroundColor="transparent"
          translucent={false}
        />
        <Navigation />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
