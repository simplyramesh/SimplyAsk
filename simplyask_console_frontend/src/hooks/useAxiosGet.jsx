import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import { DEFAULT_API } from '../Services/axios/AxiosInstance';

const useAxiosGet = (url, initialFetch = true, api = DEFAULT_API, initialRes = []) => {
  const [response, setResponse] = useState(initialRes);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isAccountDisabled } = useUser();
  const { CancelToken } = axios;
  const source = CancelToken.source();

  const cnstPathName = window.location.pathname;
  const cnstPageName = cnstPathName.split('/');
  const PageName = cnstPageName.at(-1);

  if (url.includes('?')) {
    url += `&pagename=${PageName}`;
  } else {
    url += `?pagename=${PageName}`;
  }

  const fetchData = useCallback(
    async (resetIsLoading = true, config = null) => {
      if (url?.includes('undefined') || isAccountDisabled) {
        if (!isAccountDisabled) {
          setError('Something went wrong!');
          setIsLoading(false);
        }
        return;
      }

      if (resetIsLoading) setIsLoading(true);

      try {
        api
          .get(url, {
            cancelToken: source.token,
            params: config,
          })
          .then((res) => {
            if (!res.data) throw Object.assign(new Error('No Data!'), { code: 404 });

            // pageable result
            if (res.data.content) {
              setResponse({
                content: res.data.content,
                pagination: {
                  pageNumber: res.data.pageable.pageNumber + 1,
                  totalPages: res.data.totalPages,
                  totalElements: res.data.totalElements,
                  numberOfElements: res.data.numberOfElements,
                  startingPoint: res.data.pageable.offset + (res.data.numberOfElements ? 1 : 0),
                  endingPoint: res.data.pageable.offset + res.data.numberOfElements,
                },
              });
            } else setResponse(res.data);
            setError('');
            setIsLoading(false);
          })
          .catch((e) => {
            if (!axios.isCancel(e)) {
              setError('Something went wrong!');
              setIsLoading(false);
            }
          });
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError(err.response.data);
        } else if (!axios.isCancel(err)) {
          setError('Something went wrong!');
        }
      }
    },
    [api, isAccountDisabled, url]
  );

  useEffect(() => {
    if (initialFetch) fetchData();

    return () => {
      // source.cancel();
    };
  }, [initialFetch, fetchData]);

  return {
    response,
    error,
    isLoading,
    fetchData,
    setResponse,
  };
};

export default useAxiosGet;
