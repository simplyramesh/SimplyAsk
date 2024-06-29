/* eslint-disable no-unused-vars */
import '../transition.css';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { CSSTransition } from 'react-transition-group';
import { SidedrawerModal } from 'simplexiar_react_components';

import classes from './SingleScreenDynamicButtonsSideModal.module.css';
import useSideModalWidth from '../../../../../hooks/useSideModalWidth';

const CSS_TRANSITION_ACTIVE_MENUS = {
  PRIMARY_MENU: 'primaryMenu',
  SECONDARY_MENU: 'secondaryMenu',
};

const SingleScreenDynamicButtonsSideModal = ({
  showModal = false,
  setShowModal = () => {},
  dynamicButtonsDataSchema = {},
  className = '',
  title = '',
  children,
}) => {
  const sideModalWidth = useSideModalWidth();
  const [activeMenu, setActiveMenu] = useState(CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU);

  const FallbackComponent = () => {
    return <div>Unable to load component</div>;
  };
  const [SelectedView, setSelectedView] = useState(FallbackComponent);

  const goToPrimaryMenu = () => {
    setActiveMenu(CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU);
  };

  const RenderListData = ({ dataArray = [] }) => {
    const ButtonComponent = ({ item }) => {
      const handleOnClickEvent = (data) => {
        setActiveMenu(CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU);
        setSelectedView(data?.onClickComponent ?? FallbackComponent);
      };

      return (
        <div
          className={classes.flex_col_gap_15px}
          onClick={() => handleOnClickEvent(item)}
        >
          <div className={classes.flex_row_between}>
            <div className={classes.flex_col}>
              <div className={classes.buttonMainTitle}>
                {item.buttonTitle}
              </div>
              <div className={classes.fadedText}>
                {item.isOptional && '(optional)'}
              </div>
              <div className={classes.fadedText}>
                {item.isRecommended && '(recommended)'}
              </div>
            </div>
            <InfoOutlinedIcon className={classes.infoIcon} />
          </div>
          <div className={classes.btn_parent}>
            <button className={classes.btn_main}>
              {item.buttonText}
            </button>

          </div>
        </div>
      );
    };

    ButtonComponent.propTypes = {
      item: PropTypes.shape({
        buttonTitle: PropTypes.string,
        buttonText: PropTypes.string,
        isOptional: PropTypes.bool,
        isRecommended: PropTypes.bool,
        onClickComponent: PropTypes.func,
      }),
    };

    return (
      <div className={classes.renderListRoot}>
        {dataArray?.map((item, index) => (
          <div className={classes.listColRoot} key={index}>
            <ButtonComponent item={item} />
          </div>
        ))}
      </div>
    );
  };

  RenderListData.propTypes = {
    dataArray: PropTypes.arrayOf(PropTypes.shape({
      buttonTitle: PropTypes.string,
      buttonText: PropTypes.string,
      isOptional: PropTypes.bool,
      isRecommended: PropTypes.bool,
      onClickComponent: PropTypes.func,
    })),
  };

  return (
    <div className={className}>
      <SidedrawerModal
        show={showModal}
        width={sideModalWidth}
        closeModal={() => setShowModal(false)}
        padding="0"
        hasCloseButton={false}
        styles={{ borderRadius: '30px 0 0 30px' }}
        className={classes.firstSideDrawerPosition}
        hasShrinkButton
        noPortal
      >
        <div className={classes.mainRoot}>
          <CSSTransition
            in={activeMenu === CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >

            <div className={classes.flex_col_between}>
              <div className={classes.titleRoot}>
                <div className={classes.flex_row_title}>
                  <div className={classes.title}>{title}</div>
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </div>
                <div className={classes.closeIconRoot}>
                  <CloseOutlinedIcon
                    className={classes.closeIcon}
                    onClick={() => setShowModal(false)}
                  />
                </div>

              </div>

              <div className={classes.scrollBarRoot}>
                <Scrollbars autoHide className={classes.scrollbarPadding}>
                  {children}
                  <RenderListData
                    dataArray={dynamicButtonsDataSchema?.requestConfigurationButtons}
                  />
                  <div className={classes.divider} />
                  <div className={classes.sectionTitle}>
                    Response Configuration
                  </div>
                  <RenderListData
                    dataArray={dynamicButtonsDataSchema?.responseConfiguration}
                  />
                </Scrollbars>
              </div>

              <div className={classes.bottomCurve} />
            </div>
          </CSSTransition>
          <CSSTransition
            in={activeMenu === CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
            <div className={classes.secondViewRoot}>
              <div className={classes.backBtnRoot}>
                <KeyboardBackspaceIcon
                  className={classes.backBtnIcon}
                  onClick={goToPrimaryMenu}
                />
                <div className={classes.confirmBtnRoot}>
                  <button className={classes.confirmBtn}>
                    Confirm
                  </button>
                </div>
              </div>
              <Scrollbars autoHide>
                <div className={classes.selectedViewRoot}>
                  {SelectedView}
                </div>
              </Scrollbars>
            </div>
          </CSSTransition>
        </div>
      </SidedrawerModal>
    </div>
  );
};

export default SingleScreenDynamicButtonsSideModal;

SingleScreenDynamicButtonsSideModal.propTypes = {
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
  dynamicButtonsDataSchema: PropTypes.shape({
    requestConfigurationButtons: PropTypes.arrayOf(PropTypes.shape({
      buttonTitle: PropTypes.string,
      buttonText: PropTypes.string,
      isOptional: PropTypes.bool,
      onClickComponent: PropTypes.func,
    })),
    responseConfiguration: PropTypes.arrayOf(PropTypes.shape({
      buttonTitle: PropTypes.string,
      buttonText: PropTypes.string,
      isRecommended: PropTypes.bool,
      onClickComponent: PropTypes.func,
    })),
  }),

  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.element,
};
