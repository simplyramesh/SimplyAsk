import { useEffect } from 'react';

const useScript = (url, type = 'text/javascript') => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.type = type;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, type]);
};

export default useScript;
