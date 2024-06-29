import React from 'react';
import { Helmet } from 'react-helmet';

export const CustomHelmet = ({ dynamicText }) => {
  if (!dynamicText) return null;

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content={`${dynamicText} - Optimize Business and IT Operations With Symphona by SimplyAsk.ai`}
      />
      <title>{dynamicText} - Symphona</title>
    </Helmet>
  );
};
