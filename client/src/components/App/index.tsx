import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { RequestsPage } from "../RequestsPage";
import { ScenariosPage } from "../ScenariosPage";
import "./styles.css";

const items = [
  { label: "Requests", key: "requests" },
  { label: "Scenarios", key: "scenarios" },
];

const pages = {
  requests: RequestsPage,
  scenarios: ScenariosPage,
};

export const App = () => {
  const [selectedPage, selectPage] = useState("requests");

  const PageComponent = pages[selectedPage];

  return (
    <Layout style={{ minHeight: "100%" }}>
      <Layout.Sider>
        <Menu
          items={items}
          theme="dark"
          onClick={(event) => selectPage(event.key)}
          selectedKeys={[selectedPage]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <PageComponent />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
