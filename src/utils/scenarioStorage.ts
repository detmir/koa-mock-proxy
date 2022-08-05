// Список доступны сценариев mock сервера
const availableScenarios = [];

// Список активных сценариев mock сервера
let activeScenarios = [];

let scenariosData = {};

export const setActiveScenarios = async (nextScenarios: string | string[]) => {
  activeScenarios = Array.isArray(nextScenarios)
    ? nextScenarios
    : [nextScenarios];

  // всегда сбрасываем данные сценария, даже если сценарий тот же
  // это намеренно, чтобы при установке сценария восстанавливалось изначальное состояние
  scenariosData = {};
};

export const getActiveScenarios = () => [...activeScenarios];

export const addAvailableScenario = (scenario) => {
  availableScenarios.push(scenario);
};

export const addAvailableScenarios = (scenarios) => {
  [].push.apply(availableScenarios, scenarios);
};

export const getAvailableScenarios = () => [...availableScenarios];

export const setScenariosData = (key, value) => {
  scenariosData[key] = value;
};

export const getScenariosData = (key) => scenariosData[key];
