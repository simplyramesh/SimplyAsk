export const isUserHaveAccessToProcess = (user, userIds, userGroupIds) => {
  return !!(
    userIds.find((id) => id === user.id) ||
    userGroupIds.find((id) => user.userGroups.find((userGroup) => userGroup.id === id))
  );
};
