import React, { useState } from 'react'
import { StyleSheet } from "react-native";
import { Text, View, Button } from "react-native-ui-lib";
import { Select } from './Select'
import { DateRange } from './DateRange';

export const Filter = ({ items = [], onChange }) => {
  const [values, setValues] = useState({})

  const handleChange = (field, value) => {
    const nextValues = {
      ...values,
      [field]: value
    }
    setValues(nextValues)
    onChange(nextValues)
  }

  return <View style={styles.root}>
    {items.map(item => <View key={item.field} style={{
      ...styles.item,
      ...item.style
    }}>
      {item.formType === 'select' && <Select options={item.restProps.options} placeholder={item.placeholder} onChange={value => handleChange(item.field, value)} />}
      {item.formType === 'dateRange' && <DateRange onChange={value => handleChange(item.field, value)} />}
      {item.formType === 'button' && <Button size='small' borderRadius={0} label={item.restProps.text} />}
    </View>)}
  </View>
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap'
    // height: 40
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: '50%',
  }
})