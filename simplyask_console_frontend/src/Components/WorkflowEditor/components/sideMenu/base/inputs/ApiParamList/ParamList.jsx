import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';
import EditAltIcon from '../../../../../Assets/Icons/editAlt.svg?component';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import DragAndDropIcon from '../../../../../Assets/Icons/DragAndDropIcon.svg?component';

import {
  StyledParamListActionWrapper,
  StyledParamListContainer,
  StyledParamListIconWrapper,
  StyledParamListTextWrapper,
} from './StyledParamList';

const ParamList = ({
  children,
  index,
  draggable,
  onEditClick = () => {},
  onDeleteClick = () => {},
  editProps = {}, // Added for Expected Params ('id' for icon click), onClick could be used here but id is only required for one component
  deleteProps = {},
}) => {
  const { colors } = useTheme();

  return (
    <StyledParamListContainer>
      {index && (
        <StyledFlex gap="30px" width="35px">
          <StyledFlex>{index}</StyledFlex>
          {draggable && (
            <StyledFlex>
              <DragAndDropIcon />
            </StyledFlex>
          )}
        </StyledFlex>
      )}
      <StyledParamListTextWrapper>{children}</StyledParamListTextWrapper>
      <StyledParamListActionWrapper>
        <StyledParamListIconWrapper onClick={onEditClick} {...editProps}>
          <EditAltIcon />
        </StyledParamListIconWrapper>
        <StyledDivider borderWidth={1.5} color={colors.peachPuff} flexItem />
        <StyledParamListIconWrapper onClick={onDeleteClick} {...deleteProps}>
          <TrashIcon />
        </StyledParamListIconWrapper>
      </StyledParamListActionWrapper>
    </StyledParamListContainer>
  );
};

export default ParamList;

ParamList.propTypes = {
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  editProps: PropTypes.shape({
    id: PropTypes.string,
  }),
  deleteProps: PropTypes.shape({
    id: PropTypes.string,
  }),
  children: PropTypes.node,
};
