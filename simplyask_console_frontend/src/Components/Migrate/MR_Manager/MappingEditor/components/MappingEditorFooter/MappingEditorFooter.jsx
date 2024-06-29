import PropTypes from 'prop-types';

import css from './MappingEditorFooter.module.css';

const MappingEditorFooter = ({ children }) => {
  return (
    <footer className={css.footer}>
      <div />
      <div className={css.footer_right}>
        {children}
      </div>
    </footer>
  );
};

export default MappingEditorFooter;

MappingEditorFooter.propTypes = {
  children: PropTypes.node,
};
