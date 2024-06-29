import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';

import css from './SideModal.module.css';

const SideModal = ({ isModalOpen, children }) => {
  return (
    <Portal node={document?.getElementById('root')}>
      <>
        <div className={classnames({
          [css.portal_wrapper]: isModalOpen,
        })}
        >
          <aside className={classnames({
            [css.sideModal]: true,
            [css['sideModal-open']]: isModalOpen,
          })}
          >
            {children}
          </aside>
        </div>
      </>
    </Portal>
  );
};

export default SideModal;

SideModal.propTypes = {
  isModalOpen: PropTypes.bool,
  children: PropTypes.node,
};
