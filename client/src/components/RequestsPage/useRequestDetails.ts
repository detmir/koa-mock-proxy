import { useState } from "react";
import { apiRequest } from "../../helpers/apiRequest";
import { RequestDetails } from "../../../../src/middlewares/logMiddleware";

export const useRequestDetails = () => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(
    null
  );

  const loadData = async (id: string) => {
    const data = await apiRequest({ url: `logs/${id}` });

    setRequestDetails(data);
  };

  const onOpen = (id: string) => {
    setVisible(true);
    setRequestDetails(null);
    loadData(id);
  };
  const onClose = () => setVisible(false);

  return { isVisible, onOpen, onClose, requestDetails };
};
