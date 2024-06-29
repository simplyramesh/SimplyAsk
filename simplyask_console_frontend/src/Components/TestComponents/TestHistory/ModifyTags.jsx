import PropTypes from 'prop-types';
import { useState } from 'react';
import { SidedrawerModal } from 'simplexiar_react_components';

import { useFixedSideModalWidth } from '../../../hooks/useSideModalWidth';
import AllTagsSideModal from '../../shared/ManagerComponents/SideModals/AllTagsSideModal/AllTagsSideModal';
import { CustomizedTooltip } from './StyledCustomizedTooltip';
import classes from './TestHistory.module.css';

const ModifyTags = ({ val }) => {
  const tags = val.tags;
  const tagsCount = tags?.length;
  const visibleTags = tags?.slice(0, 3);
  const restTags = tags?.slice(3, tagsCount);
  const [showAllTagsSideDrawer, setShowAllTagsSideDrawer] = useState(false);
  const [hoverEffect] = useState(true);

  const isMediumWidth = true;
  const fixedSideModalWidth = useFixedSideModalWidth(isMediumWidth);

  const renderTags = (tags) => tags.map((tag, index) => <span key={index} className={classes.tag}>{tag.name}</span>);

  const handleTagsClickFunction = (e) => {
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    setShowAllTagsSideDrawer(true);
  };

  const handleTagsClickCloseFunction = (e) => {
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    setShowAllTagsSideDrawer(false);
  };

  if (!tagsCount) return '---';

  return (
    <div className={classes.tags}>
      {renderTags(visibleTags)}
      {tagsCount > 3 && (
        <CustomizedTooltip
          title={(
            <div className={`${classes.tags} ${classes.oneRow}`}>
              {renderTags(restTags)}
            </div>
          )}
          disableHoverListener={hoverEffect}
          arrow
          placement="top"
        >
          <span id="showTags" className={`${classes.tag}`} onClick={handleTagsClickFunction}>
            +
            {tagsCount - 3}
          </span>
        </CustomizedTooltip>
      )}
      <SidedrawerModal
        show={showAllTagsSideDrawer}
        closeBtnClassName={classes.sideModalCloseIcon}
        width={fixedSideModalWidth}
        padding="0"
        useCloseBtnClassName
        closeModal={handleTagsClickCloseFunction}
      >
        <AllTagsSideModal
          name={val.displayName}
          allTags={tags}
        />
      </SidedrawerModal>
    </div>
  );
};

export default ModifyTags;

ModifyTags.propTypes = {
  val: PropTypes.object,
};
