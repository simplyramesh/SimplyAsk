export default Object.freeze({
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT_CONFIGURATOR: 'AGENT_CONFIGURATOR',
  WORKFLOW_CONFIGURATOR: 'WORKFLOW_CONFIGURATOR',
  USER: 'USER',
  OWNER: 'OWNER',
});

export const permissions = Object.freeze({
  READ_ONLY: 'READ_ONLY',
  FULL_ACCESS: 'FULL_ACCESS',
  NO_ACCESS: 'NO_ACCESS',
});

export const validateVisiblePermissionBasedOnRole = (permissionStatus) => {
  return permissionStatus === permissions.FULL_ACCESS || permissionStatus === permissions.READ_ONLY;
};

export const validateReadPermissionBasedOnRole = (permissionStatus) => {
  return permissionStatus === permissions.READ_ONLY;
};
