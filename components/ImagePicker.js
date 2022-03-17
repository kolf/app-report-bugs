import * as React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Text, Image, Button } from 'react-native-ui-lib'
import { Colors } from '../config'

const imageWidth = (Dimensions.get('window').width - 24) / 3
const gap = 6


export const ImagePicker = ({ files, showAddBtn }) => {
  return <View style={styles.root} paddingH-12>
    {files.map((file, index) => <View paddingV-6 width={imageWidth} center key={file.url + index}>
      <Image source={{ uri: file.url }} style={{
        height: imageWidth - gap * 2, width: imageWidth - gap * 2,
        backgroundColor: '#f5f5f5'
      }} />
    </View>)}
    {showAddBtn && <View padding-6 height={imageWidth} width={imageWidth}>
      <View style={styles.add} flex center>
        <Image aspectRatio={1} style={{ width: 60, height: 60 }} assetName="add" assetGroup="icons" />
      </View>
    </View>}
  </View>
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap',
    minHeight: imageWidth
  },
  add: {
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%'
  }
})