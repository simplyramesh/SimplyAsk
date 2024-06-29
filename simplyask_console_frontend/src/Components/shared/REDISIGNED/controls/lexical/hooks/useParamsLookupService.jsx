import { useEffect, useState } from 'react';
export const useParamsLookupService = (paramsString, params) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const results = paramsString?.length
      ? params.filter((param) => param?.label?.toLowerCase().includes(paramsString?.toLowerCase()))
      : params;

    setResults(results);
  }, [paramsString, params]);

  return results;
};
