// index: "序号",
// call_1: "数量"

export const makeTableCellData = (dataIndexMap, data, size) => {
  return Object.entries(dataIndexMap).reduce((result, [key, value]) => {
    if (key === "index") {
      return result;
    }

    console.log(data, size, "data");

    result[value] = (data || Array.from({ length: size }, () => ({}))).map(
      item => {
        return {
          data: item[key] || 0
        };
      }
    );
    return result;
  }, {});
};
