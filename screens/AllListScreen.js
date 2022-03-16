import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TableView } from "../components/TableView";
import { Filter } from '../components'
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

  const filterItems = useMemo(() => {
    return [{
      field: 'bugId',
      formType: 'select',
      placeholder: '请选择虫害',
      restProps: {
        options: [defaultOption, ...bugCategoryRange],
      }
    }, {
      field: 'district',
      formType: 'select',
      placeholder: '请选择区域',
      restProps: {
        options: [{ label: '全部' }, ...districtRange],
      }
    }, {
      field: 'date',
      formType: 'dateRange',
      placeholder: '请选择时间',
      style: {
        width: '60%',
        flex: 'auto'
      }
    }]
  }, [districtRange, bugCategoryRange])

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
    <View style={styles.container}>
      <Filter items={filterItems} onChange={onFilter}></Filter>
      <TableView columns={columns} dataSource={makeData} onClick={handleClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
