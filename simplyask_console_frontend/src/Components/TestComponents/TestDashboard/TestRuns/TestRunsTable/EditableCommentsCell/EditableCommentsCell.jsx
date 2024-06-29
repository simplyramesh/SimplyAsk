import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { TEST_RUN_COLUMN_KEYS } from '../../utils/helpers';

const NUMBER_OF_LINES = 4;
const LINE_HEIGHT = 19.5;

const textWithLinks = (text) => {
  return text.replace(
    /((http(s)?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/g,
    (match) => {
      const url = match.replace(/^(?!(http(s)?:\/\/))/, 'https://');

      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    },
  );
};

const EditableCommentsCell = ({ row }) => {
  const { colors } = useTheme();

  const [showFullText, setShowFullText] = useState(false);

  const [text, setText] = useState({ text: '', show: true, isTruncated: false });

  const cellValue = row.original?.[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT];

  const toggleShowFullText = (e) => {
    e.stopPropagation();

    setShowFullText((prev) => !prev);
  };

  const showMoreButton = (
    <StyledText
      as="span"
      display="inline"
      lh={LINE_HEIGHT}
      color={colors.linkColor}
      onClick={toggleShowFullText}
      cursor="pointer"
      wrap="nowrap"
    >
      {`${showFullText ? ' Show Less' : '...Show More'}`}
    </StyledText>
  );

  return (
    <StyledFlex
      display={!text.show || showFullText ? 'inline-block' : 'flex'}
      sx={{
        '& a': {
          display: 'inline',
          color: colors.linkColor,
          margin: 0,
          padding: 0,
          fontFamily: 'Montserrat',
          fontStyle: 'normal',
          fontSize: '16px',
          lineHeight: '19.5px',
          textDecoration: 'none',
          fontWeight: 400,
          textAlign: 'left',
          cursor: 'pointer',
        },
        '& p:first-of-type': {
          display: 'inline',
          color: colors.primary,
          margin: 0,
          padding: 0,
          fontFamily: 'Montserrat',
          fontStyle: 'normal',
          fontSize: '16px',
          lineHeight: '19.5px',
          fontWeight: 400,
          textAlign: 'left',
          cursor: 'inherit',
        },
      }}
    >
      <>
        {text.show && (
          <LinesEllipsis
            component="p"
            text={cellValue}
            ellipsis={showMoreButton}
            maxLine={NUMBER_OF_LINES}
            onReflow={({ clamped, text }) => {
              setText({ text: textWithLinks(text, colors), show: false, isTruncated: clamped });
            }}
          />
        )}
        {!text.show && (
          <>
            <StyledText lh={LINE_HEIGHT} as="span" display="inline" dangerouslySetInnerHTML={{ __html: text.text }} />
            {!showFullText && text.isTruncated && showMoreButton}
          </>
        )}
        {showFullText && (
          <>
            <StyledText lh={LINE_HEIGHT} as="span" display="inline" dangerouslySetInnerHTML={{ __html: textWithLinks(cellValue, colors) }} />
            {showMoreButton}
          </>
        )}
      </>

    </StyledFlex>
  );
};

export default EditableCommentsCell;

EditableCommentsCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
  }),
  row: PropTypes.shape({
    original: PropTypes.object,
  }),
  table: PropTypes.shape({
    setEditingRow: PropTypes.func,
  }),
};
