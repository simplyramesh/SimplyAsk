import PropTypes from 'prop-types';
import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

const rootElement = document.querySelector(':root');
const FULL_WIDTH = '216px';
// const FULL_WIDTH = '250px';
const MINIMIZED_WIDTH = '56px';
// const MINIMIZED_WIDTH = '75px';

const SideDrawerContext = createContext();

export const useSideDrawer = () => {
  return useContext(SideDrawerContext);
};

export const SideDrawerProvider = ({ children }) => {
  const [isFullWidth, setIsFullWidth] = useState(false);

  useEffect(() => {
    if (isFullWidth) rootElement.style.setProperty('--sidedrawerWidth', FULL_WIDTH);
    else rootElement.style.setProperty('--sidedrawerWidth', MINIMIZED_WIDTH);
  }, [isFullWidth]);

  const onChangeWidth = () => {
    setIsFullWidth((prev) => !prev);
  };

  return (
    <SideDrawerContext.Provider value={{ isFullWidth, onChangeWidth }}>{children}</SideDrawerContext.Provider>
  );
};

SideDrawerProvider.propTypes = {
  children: PropTypes.node,
};
