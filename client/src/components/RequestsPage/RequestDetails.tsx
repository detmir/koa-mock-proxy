import React from "react";
import { Descriptions, Drawer, Space, Spin, Typography } from "antd";
import type { RequestDetails as RequestDetailsType } from "../../../middlewares/logMiddleware";
import * as styles from "./style.module.css";

interface RequestDetailsProps {
  isVisible: boolean;
  onClose: () => void;
  requestDetails?: RequestDetailsType;
}

const labelStyle = {
  width: "30%",
  "text-align": "right",
};

interface HeadersProps {
  headers: Record<string, string | number | string[]>;
  title: string;
}

const Headers = ({ headers, title }: HeadersProps) => (
  <Descriptions title={title} column={1} size="small" bordered>
    {Object.entries(headers).map(([headerName, headerValue]) => (
      <Descriptions.Item label={headerName} labelStyle={labelStyle}>
        <div className={styles.bodyText}>
          {Array.isArray(headerValue) ? headerValue.join(",") : headerValue}
        </div>
      </Descriptions.Item>
    ))}
  </Descriptions>
);

const RequestDetailsBody = ({
  requestDetails,
}: {
  requestDetails?: RequestDetailsType;
}) => {
  if (!requestDetails) {
    return <Spin />;
  }

  return (
    <Space direction="vertical">
      {requestDetails.logMessages && (
        <>
          <Space>
            <Typography.Title level={5}>Log messages</Typography.Title>
          </Space>
          <div>
            {requestDetails.logMessages.map((message) => (
              <>
                {message}
                <br />
              </>
            ))}
          </div>
        </>
      )}

      <Headers
        headers={requestDetails.requestHeaders ?? {}}
        title="Request headers"
      />
      <Headers
        headers={requestDetails.responseHeaders ?? {}}
        title="Response headers"
      />

      {requestDetails.request && (
        <Space>
          <Typography.Title level={5}>Request body</Typography.Title>
          {requestDetails.request}
        </Space>
      )}
      <Space>
        <Typography.Title level={5}>Response body</Typography.Title>
      </Space>
      <Space direction="vertical">
        <div className={styles.bodyText}>{requestDetails.response}</div>
      </Space>
    </Space>
  );
};

export const RequestDetails = ({
  isVisible,
  onClose,
  requestDetails,
}: RequestDetailsProps) => (
  <Drawer
    title="Request details"
    placement="right"
    width="50%"
    onClose={onClose}
    visible={isVisible}
  >
    <RequestDetailsBody requestDetails={requestDetails} />
  </Drawer>
);
