import * as React from 'react';
import { StyleSheet, Pressable } from "react-native";
import { View, Text, ActionSheet, Picker } from "react-native-ui-lib";
import { Colors } from '../config'

export const Select = ({ title, value: propsValue, unstyle, onChange, options = [], placeholder, rangeKey = 'label' }) => {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(-1)

  React.useEffect(() => {
    if (propsValue && propsValue !== value) {
      setValue(propsValue)
    }
  }, [propsValue])

  const memoOptions = React.useMemo(() => {
    return [...options.map((item, index) => ({
      label: item[rangeKey],
      onPress() {
        setValue(index)
        onChange(index);
      },
    })), { label: "取消" }]
  })


  const valueText = React.useMemo(() => {
    if (value === -1) {
      return placeholder
    }
    return options[value][rangeKey]
  }, [value, options])

  // console.log(options, rangeKey, value, 'value')
  if (!options) {
    return null
  }


  return (
    <>
      <Pressable style={unstyle ? null : styles.root} onPress={(e) => setVisible(true)}>
        <Text>
          {valueText}
        </Text>
      </Pressable>
      <ActionSheet
        useSafeArea
        showCancelButton
        // useNativeIOS
        title={title}
        cancelButtonIndex={options.length}
        destructiveButtonIndex={value}
        options={memoOptions}
        visible={visible}
        onDismiss={(e) => setVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    padding: 5,
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    display: 'flex',
    alignItems: 'center'
  }
})