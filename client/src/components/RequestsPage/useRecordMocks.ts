import { useState } from "react";
import { message } from "antd";
import { apiRequest } from "../../helpers/apiRequest";

export const useRecordMocks = (
  logIds: string[],
  onRecordSuccess?: () => void
) => {
  const [isRecording, setIsRecording] = useState(false);

  const recordMocks = async () => {
    setIsRecording(true);
    try {
      const { successCount, errors } = await apiRequest({
        url: "mocks/",
        method: "POST",
        params: {
          logIds,
        },
      });

      if (successCount > 0) {
        message.success(`${successCount} mock(s) has been written!`);
      }

      if (errors.length > 0) {
        errors.forEach((error) => {
          message.error(`Error: ${error}`);
        });
      }

      onRecordSuccess && onRecordSuccess();
    } finally {
      setIsRecording(false);
    }
  };

  return { recordMocks, isRecording };
};
