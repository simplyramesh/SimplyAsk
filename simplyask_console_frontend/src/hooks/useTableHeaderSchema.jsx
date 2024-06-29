/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import { convertUserTimeZoneToAbbr } from '../utils/helperFunctions';

const useTableHeaderSchema = (
  headerSchema,
  timezoneName,
  setHeaderSchema = () => {},
  APPEND_FUNCTION_FORMAT = false
) => {
  const { user } = useUser();
  const [modifiedHeaders, setModifiedHeaders] = useState(headerSchema);

  useEffect(() => {
    if (modifiedHeaders && user && !APPEND_FUNCTION_FORMAT) {
      const timezoneAbbr = convertUserTimeZoneToAbbr(user?.timezone);

      const appendTimeZone = headerSchema?.map((item) => {
        if (item.name.startsWith(timezoneName)) {
          item.name = `${timezoneName} (${timezoneAbbr})`;
        }
        return item;
      });

      setModifiedHeaders(appendTimeZone);
      setHeaderSchema(appendTimeZone);
    }

    if (modifiedHeaders && user && APPEND_FUNCTION_FORMAT) {
      const timezoneAbbr = convertUserTimeZoneToAbbr(user?.timezone);

      const appendTimeZone = () =>
        headerSchema?.map((item) => {
          if (item.name.startsWith(timezoneName)) {
            item.name = `${timezoneName} (${timezoneAbbr})`;
          }
          return item;
        });

      setModifiedHeaders(() => appendTimeZone);
      setHeaderSchema(() => appendTimeZone);
    }
  }, [user, APPEND_FUNCTION_FORMAT]);

  return modifiedHeaders;
};

export default useTableHeaderSchema;
