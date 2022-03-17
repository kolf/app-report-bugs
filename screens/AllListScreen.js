import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Filter, TableView, InlineForm, DateRange, Select } from '../components'
import { useDistrict, useBugCategory, useTemplateFixedPointList } from "../hooks/useData";

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


export const AllListScreen = ({ navigation }) => {
  const [query, setQuery] = useState({
    current: 1,
    size: 15,
    // district: '',
    // bugId: '',
    // startMonitorTime: '',
    // endMonitorTime: ''
  })

  const { data, error, loading } = useTemplateFixedPointList(query);
  const { data: districtRange = [] } = useDistrict()
  const { data: bugCategoryRange = [] } = useBugCategory()

  const makeData = useMemo(() => {
    if (!data) {
      return []
    }
    return data.map((item, index) => {
      return {
        ...item,
        index: index + 1
      }
    })
  }, [query.current, data])

  const handleClick = ({ id, deviceId }) => {
    navigation.navigate('Details', {
      deviceId,
      id
    })
  }

  const onFilter = values => {
    const newQuery = makeQuery(values)
    setQuery({
      ...query,
      ...newQuery
    })
  }

  return (
    <View style={styles.root}>
      <InlineForm onChange={onFilter}>
        <Select placeholder='请选择虫害' options={[defaultOption, ...bugCategoryRange]} name='bugId' />
        <Select placeholder='请选择区域' options={[{ label: '全部' }, ...districtRange]} name='district' />
        <DateRange name='date' width='70%' />
      </InlineForm>
      <TableView columns={columns} dataSource={makeData} onClick={handleClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
