import React, { useState, useEffect } from "react";

export default function useRefreshing(loading, refresh) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (loading === false && refreshing === true) {
      setRefreshing(false);
    }
  }, [loading]);

  const onRefresh = () => {
    setRefreshing(true);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      refresh();
    }, 300);
  };

  return [refreshing, onRefresh];
}
