import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import CustomTableIcons from '../../icons/CustomTableIcons';
import BaseSidebar from '../BaseSidebar';

import Spinner from '../../../Spinner/Spinner';
import {
  StyledCustomSidebar,
  StyledCustomSidebarBody,
  StyledCustomSidebarFooter,
  StyledCustomSidebarHead,
  StyledCustomSidebarHeadActions,
  StyledCustomSidebarHeadClose,
  StyledCustomSidebarHeadCustomAction,
  StyledCustomSidebarHeadTemplate,
} from './StyledCustomSidebar';

const CustomSidebar = ({
  width = 642,
  children,
  open,
  onClose,
  headerTemplate,
  customHeaderActionTemplate,
  headStyleType,
  disableCustomScroll,
  headBackgroundColor,
  isLoading,
  footer,
  ...rest
}) => {
  const customActionsRef = useRef();
  const headerTemplateRef = useRef();

  return (
    <BaseSidebar open={open} onClose={onClose} width={width} {...rest}>
      <StyledCustomSidebar>
        {isLoading && <Spinner parent fadeBgParent medium />}
        <StyledCustomSidebarHead headBackgroundColor={headBackgroundColor} headStyleType={headStyleType}>
          <StyledCustomSidebarHeadActions ref={customActionsRef}>
            <StyledCustomSidebarHeadClose>
              <CustomTableIcons icon="CLOSE" width={26} onClick={onClose} />
            </StyledCustomSidebarHeadClose>
            {customHeaderActionTemplate && (
              <StyledCustomSidebarHeadCustomAction>{customHeaderActionTemplate}</StyledCustomSidebarHeadCustomAction>
            )}
          </StyledCustomSidebarHeadActions>
          {headerTemplate && (
            <StyledCustomSidebarHeadTemplate ref={headerTemplateRef}>{headerTemplate}</StyledCustomSidebarHeadTemplate>
          )}
        </StyledCustomSidebarHead>
        <StyledCustomSidebarBody>
          {disableCustomScroll ? (
            children({
              customActionsRef,
              headerTemplateRef,
            })
          ) : (
            <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
              {children({
                customActionsRef,
                headerTemplateRef,
              })}
            </Scrollbars>
          )}
        </StyledCustomSidebarBody>
        <StyledCustomSidebarFooter>{footer}</StyledCustomSidebarFooter>
      </StyledCustomSidebar>
    </BaseSidebar>
  );
};

CustomSidebar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  width: PropTypes.number,
  headerTemplate: PropTypes.node,
  headStyleType: PropTypes.oneOf(['filter']),
  disableCustomScroll: PropTypes.bool,
};

export default CustomSidebar;
