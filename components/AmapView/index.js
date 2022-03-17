import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
  View,
  ActivityIndicator,
} from "react-native";
import { WebView as RNWebView } from "react-native-webview";
import { Colors } from "../../config";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const source = Platform.select({
  ios: require("./amap.html"),
  android: { uri: "http://116.131.52.248:8888/topark/app/amap.html" },
});

export default function AmapView({
  saveRef,
  markers: markerList,
  onClick,
}) {
  const amapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (amapRef && amapRef.current && !loading) {
      saveRef && saveRef(amapRef);
      amapRef.current.injectJavaScript(renderMarkers(markerList));
    }
  }, [loading, markerList]);

  const handleMessage = (e) => {
    onClick(e.nativeEvent.data);
  };

  function renderMarkers(markerList) {
    let result = "";

    const positions = (markerList || []).map((m) => [
      m.longitude,
      m.latitude,
      m.id,
    ]);
    result = `if(markers && markers.length>0){
        map.remove(markers)
        markers = []
      }else{
        var markers = []
      }
      var positions = ${JSON.stringify(positions)};
      for (var i = 0, marker; i < positions.length; i++) {
        (function(index){
          marker = new AMap.Marker({
            map: map,
            position: new AMap.LngLat(positions[index][0],positions[index][1])
          });
          markers.push(marker);
          marker.on('click', function(e){
            window.ReactNativeWebView.postMessage(positions[index][2])
          })
        })(i)
      };
      `;
    return result;
  }

  return (
    <RNWebView
      scrollEnabled={false}
      javaScriptEnabled={true}
      geolocationEnabled={true}
      ref={amapRef}
      style={[styles.container, { width, height }]}
      source={source}
      onMessage={handleMessage}
      onLoadEnd={() => {
        setLoading(false);
      }}
      renderLoading={() => (
        <View
          style={{
            height,
            paddingTop: parseInt(height / 3),
          }}
        >
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      )}
      // renderError={() => <View />}
      originWhitelist={["*"]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
