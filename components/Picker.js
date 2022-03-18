import * as React from 'react';
import { StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, ActionSheet, Picker as UIPicker } from "react-native-ui-lib";
import { Colors } from '../config'


export const Picker = ({ title, defaultValue, unstyle, onChange, options = [], placeholder }) => {
  const [value, setValue] = React.useState(defaultValue)

  const labelName = React.useMemo(() => {
    return options.find(option => option.value === value)?.label || placeholder
  }, [options, value])

  const handleChange = item => {
    setValue(item.value)
    onChange && onChange(item.value, item)
  }

  return (
    <UIPicker
      title={title}
      placeholder={placeholder}
      value={value}
      containerStyle={{ marginTop: 20 }}
      onChange={handleChange}
      renderPicker={() => {
        if (unstyle) {
          return <Text>{labelName}</Text>
        }
        return (
          <View style={styles.root}>
            <Text>{labelName}</Text>
          </View>
        );
      }}
    // topBarProps={{ doneLabel: 'YES', cancelLabel: 'NO' }}
    >
      {options.map((option) => <UIPicker.Item key={option.value} value={option.value} label={option.label} />)}
    </UIPicker>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    padding: 4,
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    display: 'flex',
    alignItems: 'center'
  }
})