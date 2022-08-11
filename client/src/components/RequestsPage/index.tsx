import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Table, Space, Button } from "antd";
import { useLoadRequests } from "./useLoadRequests";
import dayjs from "dayjs";
import { RequestDetails } from "./RequestDetails";
import { useRequestDetails } from "./useRequestDetails";
import { useRecordMocks } from "./useRecordMocks";

const columns = [
  {
    title: "Response time",
    dataIndex: "responseTimestamp",
    key: "responseTimestamp",
    render: (timestamp) => dayjs(timestamp).format("DD.MM.YYYY HH:mm:ss.SSS"),
  },
  {
    title: "Status code",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Method",
    dataIndex: "method",
    key: "method",
  },
  {
    title: "Url",
    dataIndex: "url",
    key: "url",
    width: 500,
    render: (url) => <div style={{ wordBreak: "break-all" }}>{url}</div>,
  },
  {
    title: "Content-type",
    dataIndex: "contentType",
    key: "contentType",
  },
  {
    title: "Mode / Response source",
    dataIndex: "responseSource",
    key: "responseSource",
    render: (responseSource, { mode }) =>
      [mode, responseSource].filter(Boolean).join(" / "),
  },
];

export const RequestsPage = () => {
  const { requests, onChangeSearch } = useLoadRequests();
  const { isVisible, onOpen, onClose, requestDetails, loading } =
    useRequestDetails();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const { recordMocks } = useRecordMocks(selectedRowKeys, () =>
    setSelectedRowKeys([])
  );

  return (
    <>
      <Space>
        <Input
          size="small"
          placeholder="Search"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            onChangeSearch(e.target.value);
          }}
        />
      </Space>

      {hasSelected && (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <Button type="primary" onClick={recordMocks}>
            Write mocks ({selectedRowKeys.length})
          </Button>
        </div>
      )}

      <Table
        dataSource={requests}
        columns={columns}
        size="small"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              onOpen(record.id);
            },
          };
        }}
        pagination={false}
        rowKey="id"
      />

      <RequestDetails
        isVisible={isVisible}
        loading={loading}
        onClose={onClose}
        requestDetails={requestDetails}
      />
    </>
  );
};
