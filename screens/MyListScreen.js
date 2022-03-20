import * as React from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { Button } from 'react-native-ui-lib'
import { Colors } from '../config'
import { InlineForm, DateRange, TableView, Picker } from '../components'
import { AuthenticatedUserContext } from "../providers";
import { useDistrict, useBugCategory, useInfiniteTemplate, useUserTemplateList } from "../hooks/useData";
import { makeTableCellData } from "../lib/makeData";

const columns = [{
  title: '序号',
  dataIndex: 'index',
  width: 48
}, {
  title: '监测点名称',
  dataIndex: 'name'
}, {
  title: '监测虫害',
  dataIndex: 'bugName'
}, {
  title: '监测时间',
  dataIndex: 'recordTime'
}]

const defaultOption = {
  value: 0,
  label: '全部'
}


const checkUserTemplateItem = (data) => {
  return data.treeId && data.preId && (data._fileList || []).length > 0
}

const makeQuery = (values) => {
  return Object.entries(values).reduce((result, item) => {
    const [key, value] = item;
    if (value) {
      if (key === 'date' && value.length > 0) {
        const [startDate, endDate] = value;
        result.startMonitorTime = startDate
        result.endMonitorTime = endDate
      } else if (typeof value === 'object') {
        result[key] = value.value === '0' ? undefined : value.value
      } else {
        result[key] = value === '全部' ? undefined : value
      }
    }

    return result
  }, {})
}


export const MyListScreen = ({ navigation }) => {
  const { user } = React.useContext(AuthenticatedUserContext)
  const [query, setQuery] = React.useState({
    userId: user.userId
    // district: '',
    // bugId: '',
    // startMonitorTime: '',
    // endMonitorTime: ''
  })

  // const { data, error, loading } = useTemplateFixedPointList(makeQuery(query));
  const { data, error, isLoading, setSize, size, isValidating, isRefreshing, onRefresh } = useInfiniteTemplate(makeQuery(query))
  const { data: districtRange = [] } = useDistrict()
  const { data: bugCategoryRange = [] } = useBugCategory()
  const { data: userTemplateList = [], removeAll } = useUserTemplateList();

  const makeData = React.useMemo(() => {
    if (!data || !userTemplateList) {
      return []
    }
    const userTemplateSize = userTemplateList.length;

    return [...userTemplateList.map((item, index) => ({
      ...item,
      status: checkUserTemplateItem(item) ? '0' : '1', // 0未上线 1不可上线
      index: index + 1
    })), ...data.map((item, index) => {
      return {
        ...item,
        status: '2',
        index: (userTemplateSize + index) + 1
      }
    })]
  }, [data, userTemplateList])

  const uploadUserTemplate = async () => {
    const uploadList = userTemplateList.map(item => ({ ...item, status: checkUserTemplateItem(item) ? '0' : '1' })).filter(item => item.status === '0')
    if (uploadList.length === 0) {
      return
    }

    try {
      const res = await removeAll(uploadList.map(item => {
        return {
          ...item,
          templateCellDataMap: makeTableCellData(item._tableDataIndexMap, item._tableData, item._tableDataSize),   // [{index:1, cell-3:1, 
          "monitorAvg": 5,
          "monitorSum": 15,
          "phenology": 1,
        }
      }))
    } catch (error) {
      // Alert.alert(`同步出错了~`)
    }
  }

  const handleClick = ({ id, deviceId, status, templateId }) => {
    if (status !== '2') {
      navigation.navigate('CreateStep1', {
        deviceId,
        templateId
      })
      return
    }
    navigation.navigate('Details', {
      deviceId,
      id
    })
  }

  const onFilter = values => {
    setQuery({
      ...query,
      ...values
    })
  }

  return (
    <View style={styles.root}>
      <InlineForm onChange={onFilter}>
        <Picker placeholder='请选择虫害' options={[defaultOption, ...bugCategoryRange]} name='bugId' />
        <Picker placeholder='请选择区域' options={[defaultOption, ...districtRange]} name='district' />
        <DateRange name='date' width='70%' />
        <Button width='30%' backgroundColor={Colors.primary} size='small' borderRadius={0} label='上传数据' onPress={uploadUserTemplate} />
        {/* <Button width='100%' size='small' borderRadius={0} label='删除全部数据' onPress={clearAll} /> */}
      </InlineForm>
      <TableView rowKey="key" pageProps={
        {
          isRefreshing, onRefresh,
          size,
          setSize
        }
      } loading={isLoading} showDot columns={columns} dataSource={makeData} onClick={handleClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
