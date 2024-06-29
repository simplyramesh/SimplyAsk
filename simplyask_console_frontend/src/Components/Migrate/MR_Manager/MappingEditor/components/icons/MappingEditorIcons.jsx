import PropTypes from 'prop-types';

import AddColIcon from '../../../../../../Assets/icons/addColumn.svg?component';
import DropDownIcon from '../../../../../../Assets/icons/arrowDropDown.svg?component';
import CheckIcon from '../../../../../../Assets/icons/checkMark.svg?component';
import CloseIcon from '../../../../../../Assets/icons/closeIcon.svg?component';
import CollapseIcon from '../../../../../../Assets/icons/collapse.svg?component';
import DragIcon from '../../../../../../Assets/icons/dragIndicator.svg?component';
import EditAltIcon from '../../../../../../Assets/icons/editAlt.svg?component';
import WarnCircleIcon from '../../../../../../Assets/icons/errorCircle.svg?component';
import ExpandMoreIcon from '../../../../../../Assets/icons/expand.svg?component';
import ExpandIcon from '../../../../../../Assets/icons/expandMore.svg?component';
import HelpIcon from '../../../../../../Assets/icons/helpCircle.svg?component';
import InfoIcon from '../../../../../../Assets/icons/infoIcon.svg?component';
import TrashIcon from '../../../../../../Assets/icons/trashIcon.svg?component';

const MAPPING_EDITOR_ICONS = {
  DRAG: DragIcon,
  DELETE: TrashIcon,
  EDIT: EditAltIcon,
  EXPAND: ExpandIcon,
  COLLAPSE: CollapseIcon,
  EXPAND_MORE: ExpandMoreIcon,
  CLOSE: CloseIcon,
  WARNING: WarnCircleIcon,
  INFO: InfoIcon,
  ADD_COLUMN: AddColIcon,
  DROPDOWN: DropDownIcon,
  CHECK: CheckIcon,
  HELP: HelpIcon,
};

const MappingEditorIcons = ({ icon, ...rest }) => {
  const Icon = MAPPING_EDITOR_ICONS[icon] || MAPPING_EDITOR_ICONS.WARNING;

  return <>{Icon && <Icon {...rest} />}</>;
};

export default MappingEditorIcons;

MappingEditorIcons.propTypes = {
  icon: PropTypes.oneOf(Object.keys(MAPPING_EDITOR_ICONS)),
};
