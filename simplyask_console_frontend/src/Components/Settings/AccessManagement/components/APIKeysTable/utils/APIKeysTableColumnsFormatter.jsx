import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { useEffect, useState } from 'react';

import CopyIcon from '../../../../../../Assets/icons/copy.svg?component';
import ShowIcon from '../../../../../../Assets/icons/eyeClose.svg?component';
import HideIcon from '../../../../../../Assets/icons/eyeIcon.svg?component';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledIconWrapper, StyledStatus, StyledText } from '../../../../../shared/styles/styled';
import { StyledActionsIconWrapper } from '../../table/StyledActions';

const NameColumn = ({ apiKey, showDefaultLabel }) => (
  <StyledFlex direction="row" alignItems="center" gap={1}>
    <StyledText as="div" size={15} weight={600}>
      {apiKey.name}
    </StyledText>
    {apiKey.default && showDefaultLabel && (
      <StyledStatus color="grey" minWidth="92px">
        Default
      </StyledStatus>
    )}
  </StyledFlex>
);

export const ValueColumn = ({ keyValue }) => {
  const MASK = '***********************************';
  const [showValue, setShowValue] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { colors } = useTheme();

  const copyValue = (value) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setShowTooltip(true);
    } else {
      unsecuredCopyToClipboard(value);
      setShowTooltip(true);
    }
  };

  useEffect(() => {
    if (showTooltip) {
      setTimeout(() => setShowTooltip(false), 1500);
    }
  }, [showTooltip]);

  return (
    <StyledFlex direction="row" gap={2} alignItems="center">
      <StyledFlex maxWidth={340} width={340}>
        {showValue ? (
          <StyledText as="span" size={16} lh={24}>
            {keyValue}
          </StyledText>
        ) : (
          <StyledText as="span" size={23} lh={24}>
            {MASK}
          </StyledText>
        )}
      </StyledFlex>
      <StyledIconWrapper
        backgroundColor="transparent"
        color={colors.primary}
        onClick={() => setShowValue((currentShowValue) => !currentShowValue)}
      >
        {showValue ? <HideIcon /> : <ShowIcon />}
      </StyledIconWrapper>
      <StyledFlex>
        <StyledTooltip title="Copied" open={showTooltip} placement="top" arrow p="4px 8px" radius="10px">
          <StyledIconWrapper
            backgroundColor="transparent"
            color={colors.primary}
            p={0}
            onClick={() => copyValue(keyValue)}
          >
            <CopyIcon />
          </StyledIconWrapper>
        </StyledTooltip>
      </StyledFlex>
    </StyledFlex>
  );
};

const unsecuredCopyToClipboard = (value) => {
  const input = document.createElement('input');
  input.setAttribute('value', value);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
};

export const DateCreatedColumn = ({ value }) => (
  <StyledText>{value ? moment(value).format('MMMM D, YYYY') : ''}</StyledText>
);

export const getAPIKeysColumns = ({ enableSorting = true, showDefaultLabel = true, onDelete, onEdit }) => [
  {
    header: 'Key Name',
    accessorKey: 'name',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row }) => <NameColumn apiKey={row.original} showDefaultLabel={showDefaultLabel} />,
    id: 'name',
    enableGlobalFilter: false,
    enableSorting,
    size: 350,
    align: 'left',
  },
  {
    header: 'Value',
    accessorKey: 'value',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <ValueColumn keyValue={cell.getValue()} />,
    id: 'value',
    enableGlobalFilter: false,
    enableSorting,
    size: 440,
    align: 'left',
  },

  {
    header: 'Date Created',
    accessorKey: 'createdDate',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <DateCreatedColumn value={cell.getValue()} />,
    id: 'createdDate',
    enableSorting,
    enableGlobalFilter: false,
    align: 'left',
    size: 200,
  },
  {
    header: 'Actions',
    id: 'actions',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row }) => (
      <StyledFlex direction="row" justifyContent="flex-end">
        {onEdit && (
          <StyledActionsIconWrapper onClick={() => onEdit(row)}>
            <CustomTableIcons icon="EDIT" width={24} />
          </StyledActionsIconWrapper>
        )}
        {onDelete && (
          <StyledActionsIconWrapper onClick={() => onDelete(row)}>
            <CustomTableIcons icon="BIN" width={24} />
          </StyledActionsIconWrapper>
        )}
      </StyledFlex>
    ),
    enableGlobalFilter: false,
    enableSorting: false,
    maxSize: 100,
    size: 100,
    align: 'right',
  },
];
