import PropTypes from 'prop-types';

import MappingEditorIcons from '../../../icons/MappingEditorIcons';
import css from './AvailableParametersSideModal.module.css';

const HEADING = 'Available Parameters';
const SUB_HEADING = 'What are Parameters';
const SUB_HEADING_TWO = 'Expression Parameters (alongside FEEL expressions)';
const NOTE = 'note';
const HELPER = ': Replace # with Source Data Number';

const temporaryBodyText = 'Some text about what parameters are for this editor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam';

const AvailableParametersSideModal = ({ onClose }) => {
  return (
    <>
      <header className={css.sideModal_header}>
        <span className={css.close_icon} onClick={onClose}><MappingEditorIcons icon="CLOSE" /></span>
      </header>
      <div className={css.sideModal_content}>
        <h2 className={css.content_title}>{HEADING}</h2>
        <p className={css.content_subTitle}>{SUB_HEADING}</p>
        <p className={css.content_body}>{temporaryBodyText}</p>
        <div className={css.content_fields}>
          <p className={css.content_subTitle}>{SUB_HEADING_TWO}</p>
          <ul className={css.fields_list}>
            {['S#SysName', 'S#ObjName', 'S#FieldName', 'S#SysValue'].map((item) => (
              <li key={item} className={css.list_item}>
                <span className={css.list_indicator}>•</span>
                <span className={css.list_expression}>{item}</span>
              </li>
            ))}
          </ul>
          <p className={css.content_note}>
            <strong>{NOTE}</strong>
            {HELPER}
          </p>
        </div>
      </div>
    </>
  );
};

export default AvailableParametersSideModal;

AvailableParametersSideModal.propTypes = {
  onClose: PropTypes.func,
};
