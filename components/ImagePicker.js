import * as React from 'react'
import { StyleSheet, Dimensions, Pressable } from 'react-native'
import { View, Text, Image, Button } from 'react-native-ui-lib'
import * as ImagePickerPro from 'expo-image-picker';
import { Colors } from '../config'

const imageWidth = (Dimensions.get('window').width - 24) / 3
const gap = 6;


export const ImagePicker = ({ files, showAddBtn, onChange }) => {
  const [imageList, setImageList] = React.useState(files || [])

  const handlerLibrary = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePickerPro.launchImageLibraryAsync({
      mediaTypes: ImagePickerPro.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      const nextImageList = [...imageList, { url: result.uri }];
      setImageList(nextImageList)
      onChange && onChange(nextImageList)
    }
  }

  return <View style={styles.root} paddingH-12>
    {imageList.map((file, index) => <View paddingV-6 width={imageWidth} center key={file.url + index}>
      <Image source={{ uri: file.url }} style={{
        height: imageWidth - gap * 2, width: imageWidth - gap * 2,
        backgroundColor: '#f5f5f5'
      }} />
    </View>)}
    {showAddBtn && imageList.length < 9 && <View padding-6 height={imageWidth} width={imageWidth}>
      <Pressable onPress={handlerLibrary} style={styles.add} flex center>
        <Image style={{ width: 60, height: 60 }} assetName="add" assetGroup="icons" />
      </Pressable>
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})