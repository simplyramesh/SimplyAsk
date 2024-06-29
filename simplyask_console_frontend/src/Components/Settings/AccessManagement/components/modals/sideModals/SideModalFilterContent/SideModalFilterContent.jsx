import PropTypes from 'prop-types';

import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import BaseSidebar from '../../../../../../shared/REDISIGNED/sidebars/BaseSidebar';
import { StyledFlex } from '../../../../../../shared/styles/styled';

const SideModalFilterContent = ({
  isModalOpen, onModalClose, onConfirm, children, width, renderChildrenOnOpen,
}) => {
  const onApplyFilters = () => {
    onConfirm();
    onModalClose(false);
  };

  return (
    <BaseSidebar
      open={isModalOpen}
      onClose={onModalClose}
      width={width || 642}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <StyledFlex direction="row" justifyContent="space-between" p="16px 20px" mb="6px">
        <CustomTableIcons
          icon="CLOSE"
          width={26}
          onClick={() => onModalClose(false)}
        />
        {
          onConfirm && typeof onConfirm === 'function' && (
            <StyledButton
              primary
              variant="contained"
              onClick={onApplyFilters}
            >
              Confirm
            </StyledButton>
          )
        }
      </StyledFlex>
      {renderChildrenOnOpen ? isModalOpen && children : children}
    </BaseSidebar>
  );
};

export default SideModalFilterContent;

SideModalFilterContent.propTypes = {
  isModalOpen: PropTypes.bool,
  onModalClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  renderChildrenOnOpen: PropTypes.bool,
};
