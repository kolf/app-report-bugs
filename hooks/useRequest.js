import useSWR from "swr";
import fetch from "unfetch";
import queryString from "query-string";

const API_ROOT = {
  "/api/dreamdeck": "https://www.dreamdeck.cn:10443",
  "/api/bjtzh": "https://zhyl.zwyun.bjtzh.gov.cn",
  "/api/qpic": "https://mapstyle.qpic.cn",
  "/api/edit":
    "http://editservice-vcg-com.cb16adeacafeb4b9b988ae5d7e8bf0fc1.cn-beijing.alicontainer.com",
};

export const getFetcher = async (url, method, data) => {
  const apiRootKey = (url.match(/(\/api\/\w+)\//) || [])[1];
  const result = await fetch(url.replace(apiRootKey, API_ROOT[apiRootKey]), {
    method: method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  })
    .then((res) => {
      return res.json();
    })
    .then(res => {
      if (res.code !== 0) {
        throw res.data
      }
      return res.data
    })
    .catch((error) => {
      throw new Error("Error: " + error);
    });

  // console.log(result, data, url)
  return result;
};

export const useRequest = (name, args, options) => {
  const url =
    args && Object.keys(args).length > 0
      ? `${name}?${queryString.stringify(args)}`
      : name;

  const { data, error, mutate } = useSWR(url, async () =>
    getFetcher(url, options.method, options.data)
  );

  const result = options.formatData ? options.formatData(data) : data;

  return {
    data: result,
    loading: !error && !data,
    refresh: mutate,
    error,
  };
};
