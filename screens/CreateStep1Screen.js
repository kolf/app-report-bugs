import * as React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Button } from 'react-native-ui-lib'
import { View as RNView, Steps, FormList, FormItem, Select } from '../components'
import { useWeather, useTemplate, usePosition, useUserTemplateList } from '../hooks/useData';
import { useLocalDate } from '../hooks/useDate';
import { Colors } from '../config'


const stepList = [{
  title: '天气物候'
}, {
  title: '监测数据采集'
}]

const treeRange = [
  {
    id: 1,
    name: "萌芽期"
  },
  {
    id: 2,
    name: "展叶期"
  },
  {
    id: 3,
    name: "初花期"
  },
  {
    id: 4,
    name: "盛花期"
  },
  {
    id: 5,
    name: "末花期"
  },
  {
    id: 6,
    name: "果期"
  },
  {
    id: 7,
    name: "落叶期"
  }
]

export const CreateStep1Screen = ({ route, navigation }) => {
  const { params } = route
  const _id = params.deviceId + '-' + params.templateId
  const { get: getUserTemplate, update: updateUserTemplate, add: addUserTemplate } = useUserTemplateList()
  const currentUserTemplate = getUserTemplate(_id)
  const { data: weatherData } = useWeather()
  const { data: positionData } = usePosition(params.deviceId)
  const { data: templateData } = useTemplate(params.templateId)
  const { date: recordTime } = useLocalDate()
  // const { data: currentUserTemplate, update: updateUserTemplate } = useUserTemplate(_id)
  const [formData, setFormData] = React.useState({
    treeId: currentUserTemplate?._treeId,
    preId: currentUserTemplate?._preId
  })

  const loading = !weatherData || !templateData || !positionData;

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleNext = () => {
    const data = {
      id: _id,
      userId: '1640764667575',
      _treeId: formData.treeId,
      _preId: formData.preId,
      name: positionData.name,
      recordTime: recordTime,
      bugName: templateData?.bugClassify?.bugName,
      bugId: templateData.bugId,
      itemId: templateData.itemId,
      deviceId: params.deviceId,
      templateId: params.templateId,
      weather: weatherData.text,
      temperature: weatherData.temp
    }
    if (currentUserTemplate) {
      updateUserTemplate(data)
    } else {
      addUserTemplate(data)
    }
    navigation.navigate('CreateStep2', params)
  }


  if (loading) {
    return null
  }


  // console.log(treeRange, templateData.treeSeedList, 'list')

  return (
    <RNView isSafe>
      <View paddingV-20><Steps
        items={stepList}
        current={0}
      /></View>
      <FormList>
        <FormItem label='测报模板'><Text text16>{templateData.templateName}</Text></FormItem>
        <FormItem label='树种' required><Select title='请选择树种' unstyle placeholder='请选择树种' rangeKey='treeName' options={templateData.treeSeedList || []} onChange={value => handleChange('treeId', value)} /></FormItem>
        {/* <FormItem label='物候' required> <Select title='请选择物候' unstyle placeholder='请选择物候' rangeKey='name' options={[treeRange]} onChange={value => handleChange('preId', value)} /></FormItem> */}
        <FormItem label='天气'><Text text16>{weatherData.text}</Text></FormItem>
        <FormItem label='温度'><Text text16>{weatherData.temp || 0}℃</Text></FormItem>
        <FormItem label='监测时间'><Text text16>{recordTime}</Text></FormItem>
        <FormItem label='测报人'><Text text16>高昱</Text></FormItem>
      </FormList>
      <View paddingV-40 paddingH-16>
        <Button label='下一步' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.primary} onPress={handleNext}></Button>
      </View>
    </RNView>
  );
};

const styles = StyleSheet.create({

});
