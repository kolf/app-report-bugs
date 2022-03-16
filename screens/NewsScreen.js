import * as React from 'react';
import { StyleSheet, ScrollView } from "react-native";
import { View, Image, Carousel } from 'react-native-ui-lib'
import { CoverItem, CoverList } from '../components'

export const NewsScreen = () => {
  return (
    <ScrollView style={styles.root}>
      <View paddingT-24>
        <Carousel containerStyle={{
          height: 200,
        }}
          loop showCounter onChangePage={() => console.log('page changed')}>
          <View flex center><Image aspectRatio={2} height={192} assetName="swiper8" assetGroup="images" /></View>
          <View flex center><Image aspectRatio={2} height={192} assetName="swiper9" assetGroup="images" /></View>
          <View flex center><Image aspectRatio={2} height={192} assetName="swiper10" assetGroup="images" /></View>
        </Carousel>
      </View>
      <CoverList>
        <CoverItem />
        <CoverItem />
      </CoverList>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
