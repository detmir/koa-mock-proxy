import { useState } from "react";
import { message } from "antd";
import { apiRequest } from "../../helpers/apiRequest";

export const useRecordMocks = (
  logIds: string,
  onRecordSuccess?: () => void
) => {
  const [isRecording, setIsRecording] = useState(false);

  const recordMocks = async () => {
    setIsRecording(true);
    try {
      await apiRequest({
        url: "mocks/",
        method: "POST",
        params: {
          logIds,
        },
      });
      message.success(`${logIds.length} mock(s) has been written!`);
      onRecordSuccess && onRecordSuccess();
    } finally {
      setIsRecording(false);
    }
  };

  return { recordMocks, isRecording };
};
