import FilePresentIcon from '@mui/icons-material/FilePresent';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/system';
import React from 'react';

import { getLighterOpacityOfColor } from '../../../utils/helperFunctions';
import { StyledFileName, StyledFileDownloadHyperLink, StyledTooltip } from '../../shared/styles/styled';
import PdfIcon from '../../shared/svgIcons/PdfIcon';

const FileMessage = ({ data, appearances }) => {
  const { colors } = useTheme();

  const renderFileIcon = () => {
    if (data.fileName.includes('.pdf')) {
      return (
        <SvgIcon
          component={PdfIcon}
          sx={{
            width: '24px',
            height: '25px',
            top: '2px',
            position: 'relative',
            color: appearances.primaryColourHex,
            marginRight: '-9px',

            '&>path': {
              fill: appearances.primaryColourHex,
            },
          }}
        />
      );
    }

    return (
      <SvgIcon
        component={FilePresentIcon}
        sx={{
          width: '23px',
          marginRight: '-2px',
          marginLeft: '-2px',
        }}
      />
    );
  };

  return (
    <StyledTooltip title={data.fileName} arrow placement="top">
      <StyledFileDownloadHyperLink
        href={data.data}
        target="_blank"
        borderColor={appearances.primaryColourHex || colors.primary}
        color={appearances.primaryColourHex}
        hoverBg={getLighterOpacityOfColor(appearances.primaryColourHex)}
      >
        {renderFileIcon()}
        <StyledFileName size={11} weight={600} color={appearances.primaryColourHex}>
          {data.fileName}
        </StyledFileName>
      </StyledFileDownloadHyperLink>
    </StyledTooltip>
  );
};

export default FileMessage;
