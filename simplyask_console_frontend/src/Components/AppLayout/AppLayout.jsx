import PropTypes from 'prop-types';
import React, {
  memo, useCallback, useState,
} from 'react';

import Spinner from '../shared/Spinner/Spinner';
import css from './AppLayout.module.css';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';

const AppLayout = ({ children, pages }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((previous) => !previous), []);

  if (!pages) {
    return (
      <Spinner global />
    );
  }

  return (
    <div className={css.container}>

      <div className={css.left}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className={css.right}>

        <Topbar />

        <main className={css.main}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default memo(AppLayout);

AppLayout.propTypes = {
  children: PropTypes.node,
  pages: PropTypes.object,
};
