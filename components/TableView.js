import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

const colors = {
  0: '#cccccc',
  2: '#13ce66',
  1: '#ff0000'
}

const renderItem = ({ dataSource, showDot, columns, onClick }) => {
  return (
    <View flex center row onClick={onClick} style={{
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
          <View center row>{showDot && column.dataIndex === 'index' && <View style={{ ...styles.dot, backgroundColor: colors[dataSource.status] }} />}
            <Text gray60 center>{dataSource[column.dataIndex] || "---"}</Text></View>
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
  showDot,
  onClick,
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
        renderItem={(data) => renderItem({ dataSource: data.item, columns, showDot, onClick })}
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
  },
  dot: {
    width: 8, height: 8,
    marginRight: 6,
    borderRadius: 4
  }
});
