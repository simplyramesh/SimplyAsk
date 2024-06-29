import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { SidedrawerModal } from 'simplexiar_react_components';

import classes from './DoubleScreenSideModal.module.css';
import useSideModalWidth from '../../../../../hooks/useSideModalWidth';

const DoubleScreenDynamicHelperSideModal = ({
  showModal = false,
  setShowModal = () => {},
  listDoubleScreenDataSchema = [],
  className = '',
  title = '',
  children,
}) => {
  const sideModalWidth = useSideModalWidth();
  const [openDoubleScreenSideModal, setOpenDoubleScreenSideModal] = useState(false);
  const [selectedComponentForDoubleSideDrawer, setSelectedComponentForDoubleSideDrawer] = useState();
  const [isSecondSideModalShrinking, setIsSecondSideModalShrinking] = useState();

  const FallbackComponent = () => {
    return <div>Unable to load component</div>;
  };

  const RenderListData = () => {
    const handleOnClick = (item) => {
      setSelectedComponentForDoubleSideDrawer(item?.onClickComponent ?? FallbackComponent);
      setOpenDoubleScreenSideModal(true);
    };

    return (
      <div className={classes.renderListRoot}>
        <div className={classes.horizontalLine} />
        <div className={classes.resources}>Resources</div>
        {listDoubleScreenDataSchema?.map((item, index) => (
          <div
            className={classes.listColRoot}
            key={index}
            onClick={() => handleOnClick(item)}
          >
            <div
              className={classes.flex_row}

            >
              <div className={classes.listRoot}>
                <div className={classes.listTitle}>
                  {item.title}
                </div>
                <div className={classes.listBody}>
                  {item.body}
                </div>
              </div>

            </div>
            {index !== listDoubleScreenDataSchema.length - 1 && (
              <div className={classes.horizontalLine} />
            )}
          </div>
        ))}
      </div>
    );
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
        noPortal
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
            <Scrollbars autoHide>
              {children}
              <RenderListData />
            </Scrollbars>
          </div>

          <div className={classes.bottomCurve} />
        </div>

        <SidedrawerModal
          show={openDoubleScreenSideModal}
          width={sideModalWidth}
          closeModal={() => setOpenDoubleScreenSideModal(false)}
          padding="0"
          hasCloseButton={false}
          styles={{
            borderRadius: '30px 0 0 30px',
            right: `calc(${sideModalWidth} - ${isSecondSideModalShrinking ? '0px' : '25px'})`,
          }}
          disableBackdropColor
          hasShrinkButton
          className={classes.secondSideDrawerPosition}
          setIsShrinkingValue={setIsSecondSideModalShrinking}
          noPortal
        >

          <div className={classes.closeIconSecondRoot}>
            <CloseOutlinedIcon
              className={classes.closeIcon}
              onClick={() => setOpenDoubleScreenSideModal(false)}
            />
          </div>
          <div className={classes.secondSideDrawerRoot}>
            {selectedComponentForDoubleSideDrawer}
          </div>

        </SidedrawerModal>
      </SidedrawerModal>
    </div>
  );
};

export default DoubleScreenDynamicHelperSideModal;

DoubleScreenDynamicHelperSideModal.propTypes = {
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
  listDoubleScreenDataSchema: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    onClickComponent: PropTypes.func,
  })),
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.element,
};
