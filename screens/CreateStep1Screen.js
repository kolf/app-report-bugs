import * as React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from 'react-native-ui-lib'
import { View as RNView, Steps, FormList, FormItem, Select } from '../components'
import { useWeather, useTemplate, usePosition, useUserTemplateList } from '../hooks/useData';
import { useLocalDate } from '../hooks/useDate';


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

export const CreateStep1Screen = ({ route }) => {
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

  console.log(weatherData, positionData, currentUserTemplate, 'currentUserTemplate')

  const loading = !weatherData || !templateData || !positionData;

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }


  if (loading) {
    return null
  }


  console.log(route, 'list')

  return (
    <RNView isSafe><View style={styles.container}>
      <Steps
        items={stepList}
        current={0}
      />
      <FormList>
        <FormItem label='测报模板'><Text text16>{templateData.templateName}</Text></FormItem>
        <FormItem label='树种' required><Select title='dsf' unstyle placeholder='请选择' rangeKey='treeName' options={templateData.treeSeedList || []} onChange={value => handleChange('treeId', value)} /></FormItem>
        <FormItem label='物候' required> <Select title='dsf' unstyle placeholder='请选择物候' rangeKey='name' options={treeRange} onChange={value => handleChange('preId', value)} /></FormItem>
        <FormItem label='天气'><Text text16>{weatherData.text}</Text></FormItem>
        <FormItem label='温度'><Text text16>{weatherData.temp || 0}℃</Text></FormItem>
        <FormItem label='监测时间'><Text text16>{recordTime}</Text></FormItem>
        <FormItem label='测报人'><Text text16>高昱</Text></FormItem>
      </FormList>
    </View></RNView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});
