import useSWR from "swr";
import fetch from "unfetch";
import queryString from "query-string";

const API_ROOT = {
  "/api/dreamdeck": "https://test.dreamdeck.cn:10443",
  "/api/bjtzh": "https://test.dreamdeck.cn",
  "/api/qpic": "https://mapstyle.qpic.cn",
};

export const getFetcher = async (url, method, data, headers) => {
  console.log(url, data, method)
  const apiRootKey = (url.match(/(\/api\/\w+)\//) || [])[1];
  try {
    const res = await fetch(url.replace(apiRootKey, API_ROOT[apiRootKey]), {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      data,
    })
    const resData = await res.json()
    // console.log(url, resData, 'API--')
    if (resData.code !== 0) {
      throw new Error(resData.msg)
    }
    return Promise.resolve(resData.data)
  } catch (error) {
    // console.error(error.message, 'error')
    return Promise.reject(error)
  }
};

export const useRequest = (name, args, options) => {
  const url =
    args && Object.keys(args).length > 0
      ? `${name}?${queryString.stringify(args)}`
      : name;

  const { data, error, mutate } = useSWR(url, async (url) =>
    getFetcher(url, options.method, options.data)
  );

  const result = options.formatData ? options.formatData(data) : data;

  // console.log(error, 'error')

  return {
    data: result,
    loading: !error && !data,
    refresh: mutate,
    error,
  };
};
