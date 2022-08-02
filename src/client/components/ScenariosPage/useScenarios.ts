import { useState, useEffect } from "react";
import { RequestDetails } from "../../../middlewares/logMiddleware";

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<RequestDetails | null>([]);

  const loadScenarios = async () => {
    const response = await fetch(`api/scenarios`);
    const data = await response.json();

    setScenarios(data.scenarios);
  };

  const saveScenarios = async (nextActiveScenarios) => {
    try {
      await fetch(`api/scenarios`, {
        method: "PUT",
        body: JSON.stringify(nextActiveScenarios),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } finally {
      loadScenarios();
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const changeActiveScenarios = (nextActiveScenarios) => {
    saveScenarios(nextActiveScenarios);
  };

  return {
    scenarios,
    activeScenarios: scenarios
      .filter((scenario) => scenario.active)
      .map((scenario) => scenario.id),
    changeActiveScenarios,
  };
};
