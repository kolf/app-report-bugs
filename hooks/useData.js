import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from 'swr/infinite'
import queryString from "query-string";
import { getFetcher, useRequest } from "./useRequest";



export const useInfiniteTemplate = (params) => {
  console.log(params, 'params')
  const PAGE_SIZE = 16;
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => `/api/bjtzh/pest/fixed/point/pageFixedPointRecord?itemId=1&size=${PAGE_SIZE}&current=${index + 1}&${queryString.stringify(params)}`, async (url) => {
    const res = await getFetcher(url);
    return res.records
  });

  const issues = data ? [].concat(...data) : [];
  const isLoading = !data && !error;
  const isLoadingMore =
    isLoading ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;


  return {
    data: issues,
    onRefresh: mutate,
    isLoading,
    isValidating,
    isRefreshing,
    size,
    setSize
  }
}

export const useAllTemplateData = () => {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = React.useState(false);

  const run = React.useCallback((list) => {
    if (!list) {
      return;
    }
    const url = `/api/dreamdeck/weather/heweather/now?location=101010600`;

    setLoading(true);
    const total = list.length * 2 + 1;
    let result = [];
    try {
      mutate(
        url,
        getFetcher(url, null)
          .then((res) => pushResult(res))
          .catch((error) => pushResult(error))
      );
      list.forEach((item) => {
        const { deviceId, templateId } = item;
        const url1 = `/api/bjtzh/pest/point/position/getPointInfoBy/${deviceId}`;
        const url2 = `/api/bjtzh/pest/template/getTemplateInfoBy/${templateId}?Tenant-Id=25`;
        mutate(
          url1,
          getFetcher(url1, null)
            .then((res) => pushResult(res))
            .catch((error) => pushResult(error))
        );
        mutate(
          url2,
          getFetcher(url2, null, { "Tenant-Id": 25 })
            .then((res) => pushResult(res))
            .catch((error) => pushResult(error))
        );
      });
    } catch (error) {
      setLoading(false);
    }

    const pushResult = (res) => {
      result.push(res);
      if (result.length === total) {
        setLoading(false);
      }
      return res;
    };
  }, []);

  return { run, loading };
};

export const useMarkerTemplate = () => {
  const { mutate } = useSWRConfig();
  const run = (id) => {
    return mutate(
      `/api/bjtzh/pest/device/template/listDeviceTemplate/${id}`,
      getFetcher(`/api/bjtzh/pest/device/template/listDeviceTemplate`, null, {
        deviceId: id,
      })
    );
  };

  return { run };
};

export const useUserTemplateList = () => {
  // AsyncStorage.removeItem('userTemplateList')
  const { mutate } = useSWRConfig();

  const {
    data: list,
    mutate: refresh,
    isValidating,
  } = useSWR("userTemplateList", async () => {
    try {
      const res = await AsyncStorage.getItem("userTemplateList");
      return res ? JSON.parse(res) : []
    } catch (error) {
      return [];
    }
  });

  const _makeData = React.useCallback((data) => {
    return Object.entries(data).reduce((result, item) => {
      const [key, value] = item;
      if (key === "_fileList") {
        result.imageList = value.map((item) => item.url);
        return result;
      }

      if (!/^_/.test(key) && !/(id)/.test(key) && value) {
        if (
          /^(bugId|itemId|monitorAvg|monitorSum|phenology|temperature|templateId|treeId|userId)$/.test(
            key
          )
        ) {
          result[key] = Number(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }, {});
  }, []);

  const get = React.useCallback(
    (id) => {
      if (!list) {
        return null;
      }
      return list.find((item) => item.id === id);
    },
    [list]
  );

  const remove = React.useCallback(
    async (data) => {
      try {
        const res = await getFetcher(
          `/api/bjtzh/pest/fixed/point/saveFixedPointRecord`,
          "POST",
          _makeData(data)
        );
      } catch (error) {
        return Promise.reject(error)
      }
      const nextList = list.filter((item) => item.id !== data.id);
      AsyncStorage.setItem("userTemplateList", JSON.stringify(nextList));
      refresh(nextList);
      mutate(
        `/api/bjtzh/pest/device/template/templateFixedPointDetailInfo?itemId=1`
      );
    },
    [list]
  );

  const clearAll = () => {
    AsyncStorage.setItem("userTemplateList", JSON.stringify([]));
    refresh([]);
  };

  const add = React.useCallback(
    (data) => {
      const nextList = [data, ...list];
      AsyncStorage.setItem("userTemplateList", JSON.stringify(nextList));
      refresh(nextList);
    },
    [list]
  );

  const update = React.useCallback(
    (data) => {
      const nextList = list.map((item) => {
        if (item.id === data.id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      });
      AsyncStorage.setItem("userTemplateList", JSON.stringify(nextList));
      refresh(nextList);
    },
    [list]
  );

  return { get, update, remove, add, data: list || [], isValidating, clearAll };
};

export const useMarkerList = () => {
  return useRequest(
    `/api/bjtzh/pest/point/position/listPointPositionInfo`,
    { itemId: 1, typeId: 8202 },
    {}
  );
};

export const useBugTotal = () => {
  return useRequest(
    `/api/bjtzh/pest/detail/getTodayPestNum/25`,
    null,
    {}
  );
};

export const useDetails = (id) => {
  return useRequest(
    `/api/bjtzh/pest/fixed/point/getDetailRecordBy/${id}`,
    null,
    {}
  );
};

export const usePosition = (id) => {
  return useRequest(
    `/api/bjtzh/pest/point/position/getPointInfoBy/${id}`,
    null,
    {}
  );
};

export const useTemplateFixedPoint = () => {
  return useRequest(
    `/api/bjtzh/pest/device/template/templateFixedPointDetailInfo`,
    { itemId: 1 },
    {}
  );
};

export const useTemplateFixedPointList = (query) => {
  return useRequest(
    `/api/bjtzh/pest/fixed/point/pageFixedPointRecord`,
    { itemId: 1, ...query },
    {
      formatData(res) {
        return res?.records;
      },
    }
  );
};

export const useTemplate = (id) => {
  return useRequest(
    `/api/bjtzh/pest/template/getTemplateInfoBy/${id}`,
    { "Tenant-Id": 25 },
    {}
  );
};

export const useWeather = () => {
  return useRequest(
    `/api/dreamdeck/weather/heweather/now`,
    { location: "101010600" },
    {}
  );
};

export const useDistrict = () => {
  return useRequest(
    `/api/bjtzh/pest/point/position/listDistrict/1/8202`,
    null,
    {
      formatData(res) {
        return res?.map(item => ({ label: item, value: item }))
      }
    }
  );
};

export const useBugCategory = () => {
  return useRequest(
    `/api/bjtzh/pest/bug/classify/getBugClassify`,
    { itemId: 1, levelList: 4 },
    {
      formatData(res) {
        return res?.map(item => ({ value: item.id * 1, label: item.bugName }))
      }
    }
  );
};

export const useLogin = () => {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState();

  const getToken = async (values) => {
    try {
      const res = await getFetcher('/api/dreamdeck/auth/oauth/token?grant_type=password', 'POST', values);
      console.log(res, 'res')
    } catch (error) {
      console.error(error, 'error')
    }
  }

  const getUser = (token) => {
    getFetcher('/api/dreamdeck/admin/user/token/info', 'GET', null, token)
  }



  return { getUser, getToken, data, error }
}