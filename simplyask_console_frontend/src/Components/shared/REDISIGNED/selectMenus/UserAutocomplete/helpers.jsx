import { debounce } from 'lodash';

import { getUsersWithFilters } from '../../../../../Services/axios/permissionsUsers';

const mapUsers = (response) => response?.content.map(({
  firstName,
  lastName,
  id,
  pfp,
}) => ({
  label: `${firstName} ${lastName}`,
  value: {
    firstName,
    lastName,
    id,
    pfp,
  },
}));

export const promiseOptions = debounce((inputValue, callback) => {
  getUsersWithFilters(new URLSearchParams({ searchText: inputValue }))
    .then(mapUsers)
    .then((resp) => callback(resp));
}, 300);

export const promiseUserOptionsDefault = () => {
  return getUsersWithFilters(new URLSearchParams({ searchText: '' }))
    .then(mapUsers);
};
