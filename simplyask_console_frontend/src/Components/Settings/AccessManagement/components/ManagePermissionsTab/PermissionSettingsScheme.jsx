export const ACCESS_LEVEL = Object.freeze({
  READ: 'READ',
  WRITE: 'WRITE',
  CUSTOM: 'CUSTOM',
  PAGE_PERMISSION: 'PAGE_PERMISSION'
});

export const ACCESS_LEVEL_SCHEME = Object.freeze({
  WRITE: {
    title: 'Full Access Permissions',
    label: 'Full Access',
    value: 'WRITE',
  },
  READ: {
    title: 'View Only Permissions',
    label: 'View Only',
    value: 'READ',
  },
  CUSTOM: {
    title: 'Create Custom Permissions',
    label: 'Custom',
    value: 'CUSTOM',
  },
});

export const PERMISSIONS_CHAPTER = Object.freeze({
  DATA: 'DATA',
  OPERATION: 'OPERATION',
});

export const EDIT_PERMISSIONS_TYPE = Object.freeze({
  ADD: 'ADD',
  EDIT: 'EDIT',
});

export const USER_TYPE = Object.freeze({
  USER: 'user',
  USER_GROUP: 'userGroup',
});