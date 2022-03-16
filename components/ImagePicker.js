import * as React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Text, Image, Button } from 'react-native-ui-lib'
import { Colors } from '../config'

const imageWidth = (Dimensions.get('window').width - 24) / 3
const gap = 6


export const ImagePicker = ({ files, showAddBtn }) => {


  // return <GridView
  //   items={files}
  //   numColumns={3}
  //   renderCustomItem={(file) => renderCustomItem(file)}
  // />

  return <View row flexWrap paddingH-12>
    {files.map((file, index) => <View paddingV-6 width={imageWidth} center key={file.url + index}>
      <Image borderRadius={4} source={{ uri: file.url }} aspectRatio={1} height={imageWidth - gap * 2} width={imageWidth - gap * 2} />
    </View>)}
    {showAddBtn && <View padding-6 height={imageWidth} width={imageWidth}>
      <View style={styles.add} borderRadius={4} flex width={'100%'} center>
        <Image aspectRatio={1} height={60} assetName="add" assetGroup="icons" />
      </View>

    </View>}
  </View>
}

const styles = StyleSheet.create({
  root: {

  },
  add: {
    borderWidth: 1,
    borderColor: Colors.border
  }
})