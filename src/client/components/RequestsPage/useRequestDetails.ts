import { useState } from 'react';
import {RequestDetails} from "../../../middlewares/logMiddleware";

export const useRequestDetails = () => {

  const [isVisible, setVisible] = useState<boolean>(false);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);

  const loadData = async (id: string) => {
    const response = await fetch(`api/logs/${id}`);
    const data = await response.json();

    setRequestDetails(data);
  };
  console.log(requestDetails, 'requestDetails');

  const onOpen = (id: string) => {
    setVisible(true);
    setRequestDetails(null);
    loadData(id);
  };
  const onClose = () => setVisible(false);

  return { isVisible, onOpen, onClose, requestDetails };
};
