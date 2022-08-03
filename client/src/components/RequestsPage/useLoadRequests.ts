import { useEffect, useState } from "react";
import { usePersistentCallback } from "../../hooks/usePersistentCallback";
import { apiRequest } from "../../helpers/apiRequest";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useLoadRequests = () => {
  let [filters, setFilters] = useState({});
  let [requests, setRequests] = useState<[unknown]>([]);

  const loadData = usePersistentCallback(async () => {
    const data = await apiRequest({ url: "logs", params: filters });

    setRequests(data.logs);
  });

  let stopped = false;

  const startLoadingData = async () => {
    while (!stopped) {
      try {
        await loadData();
      } catch (e) {}

      await sleep(500);
    }
  };

  useEffect(() => {
    startLoadingData();
    return () => {
      stopped = true;
    };
  }, []);

  const onChangeSearch = (newSearch) => {
    setFilters({
      ...filters,
      search: newSearch,
    });
  };

  return { requests, onChangeSearch };
};
