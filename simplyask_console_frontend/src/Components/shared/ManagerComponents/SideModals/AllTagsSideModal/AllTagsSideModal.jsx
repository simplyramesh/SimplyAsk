import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import classes from './AllTagsSideModal.module.css';

const AllTagsSideModal = ({
  name = '',
  allTags = [],
  onTagClickFn = () => {},
}) => {
  return (
    <div className={classes.root}>
      <div className={classes.title}>{name}</div>
      <div className={classes.tagsTitle}>Tags</div>
      <Scrollbars className={classes.scrollbarRoot}>
        <div className={classes.scrollbarChild}>
          <div className={classes.processStatusRoot}>
            <div className={classes.overFlowingTagsRoot}>
              {allTags?.map((item, index) => {
                return (
                  <div
                    className={classes.selectedTagsRootMapOverflow}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    id={index}
                    onClick={() => onTagClickFn(item)}
                  >
                    <div id={index} className={classes.tagname}>{item.name}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </Scrollbars>
    </div>
  );
};

export default AllTagsSideModal;

AllTagsSideModal.propTypes = {
  name: PropTypes.string,
  allTags: PropTypes.array,
  onTagClickFn: PropTypes.func,

};
