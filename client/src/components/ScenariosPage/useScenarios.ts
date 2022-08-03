import { useState, useEffect } from "react";
import { RequestDetails } from "../../../../src/middlewares/logMiddleware";
import { apiRequest } from "../../helpers/apiRequest";

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<RequestDetails | null>([]);

  const loadScenarios = async () => {
    const data = await apiRequest({ url: "scenarios" });

    setScenarios(data.scenarios);
  };

  const saveScenarios = async (nextActiveScenarios) => {
    try {
      await apiRequest({
        url: "scenarios",
        method: "PUT",
        params: nextActiveScenarios,
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
