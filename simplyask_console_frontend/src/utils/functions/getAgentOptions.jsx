import { statuses } from '../serviceRequests';

export const getAgentOptions = (agents) => {
  if (!agents.some(({ name }) => name === statuses.UNASSIGNED)) agents.push({ name: statuses.UNASSIGNED, id: null });

  return agents;
};
