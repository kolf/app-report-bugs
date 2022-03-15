import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

const renderItem = ({ dataSource, columns }) => {
  return (
    <View flex center row style={{
      ...styles.row,
      backgroundColor: dataSource.index % 2 ? '#fff' : '#eee'
    }}>
      {columns.map((column) => (
        <View
          key={column.dataIndex}
          style={{
            width: column.width,
            flex: column.width ? null : 1
          }}
        >
          <Text gray60 center>{dataSource[column.dataIndex] || "---"}</Text>
        </View>
      ))}
    </View>
  );
}

export const TableView = ({
  columns = [],
  dataSource = [],
  onRefresh,
  refreshing,
  rowKey = "id",
}) => {
  return (
    <View style={styles.container}>
      <View row center style={styles.header}>
        {columns.map((column) => (
          <View
            center
            key={column.dataIndex}
            flex
            style={{ width: column.width, flex: column.width ? null : 1 }}
          >
            <Text>{column.title}</Text>
          </View>
        ))}
      </View>
      <FlatList
        ListEmptyComponent={<View />}
        renderItem={(data) => renderItem({ dataSource: data.item, columns })}
        keyExtractor={(item) => item[rowKey]}
        data={dataSource}
        style={styles.body}
        onEndReachedThreshold={1} //距离底部半屏触发事件
        initialNumToRender={4}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    height: 46,
    backgroundColor: "#ccc",
    textAlign: 'center'
  },
  body: {

  },
  row: {
    minHeight: 46
  }
});
