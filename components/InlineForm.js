import * as React from 'react'
import { StyleSheet } from "react-native";
import { Text, View, Button } from "react-native-ui-lib";
import { Select } from './Select'
import { DateRange } from './DateRange';
import { Colors } from '../config'

export const InlineForm = ({ children }) => {
  const [values, setValues] = React.useState({})

  const handleChange = (field, value) => {
    const nextValues = {
      ...values,
      [field]: value
    }
    setValues(nextValues)
    onChange(nextValues)
  }
  // const Nodes = 
  return <View style={styles.root}>{React.Children.map(children, child => {
    return <View style={{ ...styles.item, width: child.props.width || '50%' }}>{React.cloneElement({
      ...child, onChange: (value) => {
        if (!child.props.name) {
          return null
        }
        handleChange(child.props.name, value)
      }
    })}</View>
  })}</View>
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  }
})