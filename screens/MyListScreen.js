import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TableView } from "../components/TableView";
import { Filter } from '../components'
import { useDistrict, useBugCategory, useTemplateFixedPointList, useUserTemplateList } from "../hooks/useData";


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
  return data._treeId && data._preId && (data._fileList || []).length > 0
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


export const MyListScreen = () => {
  const [query, setQuery] = useState({
    current: 1,
    size: 15,
    // district: '',
    // bugId: '',
    // startMonitorTime: '',
    // endMonitorTime: ''
  })

  const { data, error, loading } = useTemplateFixedPointList({ query, userId: 1640764667575, });
  const { data: districtRange = [] } = useDistrict()
  const { data: bugCategoryRange = [] } = useBugCategory()
  const { data: userTemplateList = [], remove, clearAll } = useUserTemplateList();

  const makeData = useMemo(() => {
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
    }, {
      field: 'submit',
      formType: 'button',
      style: {
        width: '40%',
        flex: 'auto',
        textAlign: 'right'
      },
      restProps: {
        text: '立即同步',
        disabled: userTemplateList.length === 0,
        onClick() {
          uploadUserTemplate()
        }
      }
    }]
  }, [userTemplateList, districtRange, bugCategoryRange])


  const uploadUserTemplate = () => {
    const uploadList = userTemplateList.map(item => ({ ...item, status: checkUserTemplateItem(item) ? '0' : '1' })).filter(item => item.status === '0')
    if (uploadList.length === 0) {
      return
    }

    uploadList.forEach(item => {
      remove({
        ...item,
        templateCellDataMap: makeTableCellData(item._tableDataIndexMap, item._tableData, item._tableDataSize),   // [{index:1, cell-3:1, cell-1:3}]
        "monitorAvg": 5,
        "monitorSum": 15,
        "phenology": 1,
      })
    })
  }

  const handleClick = ({ id, deviceId, status, templateId }) => {
    console.log(id)
    if (status !== '2') {
      // Taro.navigateTo({
      //   url: `/pages/create-step1/index?deviceId=${deviceId}&templateId=${templateId}`
      // })
      return
    }
    // Taro.navigateTo({
    //   url: `/pages/details/index?id=${id}&deviceId=${deviceId}`
    // })
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
      <TableView showDot columns={columns} dataSource={makeData} onClick={handleClick}></TableView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
