import React from 'react';
import * as styles from './styles.module.css'
import {Checkbox, Space, Typography} from "antd";
import {useScenarios} from "./useScenarios";

export const ScenariosPage = () => {
  const { scenarios, changeActiveScenarios, activeScenarios } = useScenarios();

  return (
    <div className={styles.scenarioPage}>
      <Typography.Title level={2}>Active scenarios</Typography.Title>

      <Checkbox.Group
        value={activeScenarios}
        onChange={changeActiveScenarios}
      >
        <Space direction='vertical'>
          {scenarios.map(
            scenario => <Checkbox value={scenario.id}>{scenario.id}</Checkbox>
          )}
        </Space>
      </Checkbox.Group>
    </div>
  );
}
