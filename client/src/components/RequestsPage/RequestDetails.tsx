import React from "react";
import { Descriptions, Drawer, Space, Spin, Typography, Result } from "antd";
import * as styles from "./style.module.css";
import { RequestDetails as RequestDetailsType } from "../../../../src/middlewares/logMiddleware";
import { type } from "os";

interface RequestDetailsProps {
  isVisible: boolean;
  onClose: () => void;
  requestDetails?: RequestDetailsType;
  loading: boolean;
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
        <div className={styles.headerValue}>
          {Array.isArray(headerValue) ? headerValue.join(",") : headerValue}
        </div>
      </Descriptions.Item>
    ))}
  </Descriptions>
);

const RequestDetailsBody = ({
  requestDetails,
  loading,
}: {
  requestDetails?: RequestDetailsType;
  loading: boolean;
}) => {
  if (!requestDetails) {
    if (!loading) {
      return (
        // @ts-ignore
        <Result
          status="error"
          title="Error happened! Probably record details has been already cleaned."
        />
      );
    }

    return <Spin />;
  }

  return (
    <Space direction="vertical">
      {requestDetails.logMessages && (
        <>
          <Space>
            <Typography.Title level={5}>Log messages</Typography.Title>
          </Space>
          <div className={styles.logs}>
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
        <>
          <Space>
            <Typography.Title level={5}>Request body</Typography.Title>
          </Space>
          <Space direction="vertical">
            <div className={styles.bodyText}>
              <Typography.Paragraph code>
                {typeof requestDetails.request === "string"
                  ? requestDetails.request
                  : JSON.stringify(requestDetails.request, null, 4)}
              </Typography.Paragraph>
            </div>
          </Space>
        </>
      )}
      <Space>
        <Typography.Title level={5}>Response body</Typography.Title>
      </Space>
      <Space direction="vertical">
        <div className={styles.bodyText}>
          <Typography.Paragraph code>
            {typeof requestDetails.response === "string"
              ? requestDetails.response
              : JSON.stringify(requestDetails.response, null, 4)}
          </Typography.Paragraph>
        </div>
      </Space>
    </Space>
  );
};

export const RequestDetails = ({
  isVisible,
  loading,
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
    <RequestDetailsBody loading={loading} requestDetails={requestDetails} />
  </Drawer>
);
