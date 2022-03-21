import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View, Text, Button } from 'react-native-ui-lib'
import { View as RNView, Steps, FormList, FormItem, Select, Loading, Error } from '../components';
import { AuthenticatedUserContext } from '../providers';
import { useWeather, useTemplate, usePosition, useUserTemplateList } from '../hooks/useData';
import { useLocalDate } from '../hooks/useDate';
import { Colors } from '../config'


const stepList = [{
  title: '天气物候'
}, {
  title: '监测数据采集'
}]

const treeTypeList = [
  {
    value: 1,
    label: "萌芽期"
  },
  {
    value: 2,
    label: "展叶期"
  },
  {
    value: 3,
    label: "初花期"
  },
  {
    value: 4,
    label: "盛花期"
  },
  {
    value: 5,
    label: "末花期"
  },
  {
    value: 6,
    label: "果期"
  },
  {
    value: 7,
    label: "落叶期"
  }
]

export const CreateStep1Screen = ({ route, navigation }) => {
  const { params } = route
  const _id = params.deviceId + '-' + params.templateId
  const { user } = React.useContext(AuthenticatedUserContext)
  const { get: getUserTemplate, update: updateUserTemplate, add: addUserTemplate } = useUserTemplateList()
  const currentUserTemplate = getUserTemplate(_id)
  const { data: weatherData } = useWeather()
  const { data: positionData, error: positionError } = usePosition(params.deviceId)
  const { data: templateData, error: templateError } = useTemplate(params.templateId)
  const { date: recordTime } = useLocalDate()
  // const { data: currentUserTemplate, update: updateUserTemplate } = useUserTemplate(_id)
  const [formData, setFormData] = React.useState({
    treeId: currentUserTemplate?.treeId,
    preId: currentUserTemplate?.preId
  })

  const loading = !weatherData && !templateData && !positionData;
  const error = positionError || templateError

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  // console.log(user, 'user')

  const handleNext = () => {
    const data = {
      id: _id,
      userId: user.userId,
      treeId: formData.treeId,
      preId: formData.preId,
      name: positionData?.name,
      recordTime: recordTime,
      bugName: templateData?.bugClassify?.bugName,
      bugId: templateData?.bugId,
      itemId: templateData?.itemId,
      deviceId: params.deviceId,
      templateId: params.templateId,
      weather: weatherData?.text,
      temperature: weatherData?.temp,
      _district: positionData?.district
    }
    if (currentUserTemplate) {
      updateUserTemplate(data)
    } else {
      addUserTemplate(data)
    }
    navigation.navigate('CreateStep2', params)
  }

  const checkNext = React.useMemo(() => {
    return !formData.preId || !formData.treeId
  }, [formData.preId, formData.treeId])

  const treeSeedList = React.useMemo(() => {
    return templateData?.treeSeedList.map(item => ({
      value: item.id,
      label: item.treeName
    })) || []
  }, [templateData])

  if (loading) {
    return <Loading flex />
  }

  // if (error) {
  //   return <Error isPage />
  // }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View paddingV-20><Steps
        items={stepList}
        current={0}
      /></View>
      <FormList>
        <FormItem label='测报模板'><Text text16>{templateData?.templateName}</Text></FormItem>
        <FormItem label='树种' required><Select title='请选择树种' defaultValue={formData.treeId} unstyle placeholder='请选择树种' rangeKey='treeName' options={treeSeedList} onChange={value => handleChange('treeId', value)} /></FormItem>
        <FormItem label='物候' required><Select title='请选择物候' defaultValue={formData.preId} unstyle placeholder='请选择物候' options={treeTypeList} onChange={value => handleChange('preId', value)} /></FormItem>
        <FormItem label='天气'><Text text16>{weatherData?.text}</Text></FormItem>
        <FormItem label='温度'><Text text16>{weatherData?.temp || 0}℃</Text></FormItem>
        <FormItem label='监测时间'><Text text16>{recordTime}</Text></FormItem>
        <FormItem label='测报人'><Text text16>{user.nickName}</Text></FormItem>
      </FormList>
      <View paddingV-40 paddingH-16>
        <Button label='下一步' borderRadius={4} style={{ height: 48 }} disabled={checkNext} backgroundColor={Colors.primary} onPress={handleNext}></Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

});
