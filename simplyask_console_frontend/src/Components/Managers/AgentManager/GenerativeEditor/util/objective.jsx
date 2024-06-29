export const objectiveDefaultTemplate = (designId) => ({
  id: null,
  name: '',
  guidance: '',
  actions: [],
  hasChanged: false,
  designId,
});

export const actionDefaultTemplate = (designId) => ({
  id: null,
  name: '',
  type: '',
  purpose: '',
  data: {},
  isDeleted: false,
  designId,
});

export const topicDefaultTemplate = (id) => ({
  id,
  topic: '',
  deleted: false,
});
