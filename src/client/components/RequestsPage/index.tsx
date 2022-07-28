import React from 'react';
import { Table } from 'antd';
import {useLoadRequests} from "./useLoadRequests";
import dayjs from "dayjs";


const columns = [
  {
    title: 'Response time',
    dataIndex: 'responseTimestamp',
    key: 'responseTimestamp',
    render: timestamp => dayjs(timestamp).format('DD.MM.YYYY HH:mm:ss.SSS'),
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
  }
];

export const RequestsPage = () => {
  const { requests } = useLoadRequests();

  return (
    <Table
      dataSource={requests}
      columns={columns}
      size='small'
      pagination={false}
    />
  );
};
