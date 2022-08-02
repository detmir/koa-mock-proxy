import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Table, Space } from 'antd';
import {useLoadRequests} from "./useLoadRequests";
import dayjs from "dayjs";
import {RequestDetails} from "./RequestDetails";
import {useRequestDetails} from "./useRequestDetails";


const columns = [
  {
    title: 'Response time',
    dataIndex: 'responseTimestamp',
    key: 'responseTimestamp',
    render: timestamp => dayjs(timestamp).format('DD.MM.YYYY HH:mm:ss.SSS'),
  },
  {
    title: 'Status code',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'Url',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Content-type',
    dataIndex: 'contentType',
    key: 'contentType',
  },
  {
    title: 'Mode / Response source',
    dataIndex: 'responseSource',
    key: 'responseSource',
    render: (responseSource, { mode }) => `${mode} / ${responseSource}`
  }
];

export const RequestsPage = () => {
  const { requests, onChangeSearch } = useLoadRequests();
  const { isVisible, onOpen, onClose, requestDetails } = useRequestDetails();

  return (
    <>
      <Space>
        <Input size="small" placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => {
          onChangeSearch(e.target.value);
        }} />
      </Space>

      <Table
        dataSource={requests}
        columns={columns}
        size='small'
        onRow={(record) => {
          return {
            onClick: () => { onOpen(record.id) }
          };
        }}
        pagination={false}
        rowKey='id'
      />

      <RequestDetails isVisible={isVisible} onClose={onClose} requestDetails={requestDetails} />
    </>
  );
};
