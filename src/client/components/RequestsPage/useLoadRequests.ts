import {useEffect, useState} from "react";
import {usePersistentCallback} from "../../hooks/usePersistentCallback";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useLoadRequests = () => {

  let [filters, setFilters] = useState({});
  let [requests, setRequests] = useState<[unknown]>([]);

  const loadData = usePersistentCallback(async () => {
    const response = await fetch('api/logs?'+ new URLSearchParams(filters));
    const data = await response.json();

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
  }

  useEffect(() => {
    startLoadingData();
    return () => { stopped = true };
  }, []);

  const onChangeSearch = (newSearch) => {
    setFilters({
      ...filters,
      search: newSearch
    });
  }

  return { requests, onChangeSearch };
};
