import classnames from 'classnames';
import PropTypes from 'prop-types';

import css from './SaveMRMapMenu.module.css';

const SaveMRMapMenu = ({ columnNames = [], hoverClass }) => {
  return (
    <div className={classnames(css.container, hoverClass)}>
      <p className={css.num_incomplete}>
        <span>{'You have '}</span>
        <strong>{`${columnNames.length} incomplete `}</strong>
        <span>{`field${columnNames.length > 1 ? 's' : ''}. They must be completed before saving the MR map.`}</span>
      </p>
      <p className={css.incomplete_fields}>The incomplete fields include:</p>
      <ul className={css.list}>
        {columnNames.map((name) => (
          <li key={name} className={css.list_item}>
            <p className={css.item_heading}><strong>{name}</strong></p>
            <p className={css.item_text}>No “System”, “Object”, “Field”  selected yet. Either make a selection, or delete the column.</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SaveMRMapMenu;

SaveMRMapMenu.propTypes = {
  columnNames: PropTypes.arrayOf(PropTypes.string),
  hoverClass: PropTypes.string,
};
