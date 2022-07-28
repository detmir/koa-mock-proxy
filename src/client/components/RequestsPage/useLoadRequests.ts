import {useEffect, useState} from "react";

export const useLoadRequests = () => {

  let [requests, setRequests] = useState<[unknown]>([]);

  const loadData = async () => {
    const data = await fetch('api/logs').then(response => response.json());

    setRequests(data.logs);
  };

  useEffect(loadData, []);

  return { requests };
};
