import PropTypes from 'prop-types';
import { useState } from 'react';

import EditIcon from '../../../../../../Assets/icons/editAlt.svg?component';
import TrashIcon from '../../../../../../Assets/icons/trashIcon.svg?component';
import { StyledFlex } from '../../../../styles/styled';
import BaseTextArea from '../../../controls/BaseTextArea/BaseTextArea';
import { StyledButton } from '../../../controls/Button/StyledButton';
import {
  StyledTimelineAction,
  StyledTimelineActions,
  StyledTimelineConnector,
  StyledTimelineContent,
  StyledTimelineContentWrapper,
  StyledTimelineDot,
  StyledTimelineItem,
  StyledTimelineSeparator,
} from '../StyledStatusTimeline';

const StatusTimelineItem = ({ children, color, editable, value, onChange, onDelete }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [commentValue, setCommentValue] = useState(value);
  return (
    <StyledTimelineItem>
      <StyledTimelineSeparator>
        <StyledTimelineDot variant="outlined" color={color} />
        <StyledTimelineConnector />
      </StyledTimelineSeparator>
      <StyledTimelineContentWrapper editable={editable && !isEdit}>
        {isEdit ? (
          <StyledFlex>
            <BaseTextArea value={commentValue} onChange={(event) => setCommentValue(event.target.value)} />
            <StyledFlex alignSelf="flex-end" direction="row" gap={1} mt={1}>
              <StyledButton
                size="small"
                secondary
                variant="outlined"
                onClick={() => {
                  setIsEdit(false);
                  setCommentValue(value);
                }}
              >
                Cancel
              </StyledButton>
              <StyledButton
                size="small"
                secondary
                variant="contained"
                disabled={commentValue.length === 0}
                onClick={() => {
                  setIsEdit(false);
                  onChange?.(commentValue);
                }}
              >
                Save
              </StyledButton>
            </StyledFlex>
          </StyledFlex>
        ) : (
          <>
            <StyledTimelineContent color={color}>{children}</StyledTimelineContent>
            {editable && (
              <StyledTimelineActions>
                <StyledTimelineAction onClick={() => setIsEdit(true)}>
                  <EditIcon />
                </StyledTimelineAction>
                <StyledTimelineAction onClick={onDelete}>
                  <TrashIcon />
                </StyledTimelineAction>
              </StyledTimelineActions>
            )}
          </>
        )}
      </StyledTimelineContentWrapper>
    </StyledTimelineItem>
  );
};

export default StatusTimelineItem;

StatusTimelineItem.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};
