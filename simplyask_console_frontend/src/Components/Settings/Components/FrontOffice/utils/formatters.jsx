/* eslint-disable no-unused-vars */
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { InfoOutlined } from '@mui/icons-material';
import React, { useState } from 'react';

import routes from '../../../../../config/routes';
import {
  capitalizeFirstLetterOfRegion,
  formatPhoneNumber,
  formatPhoneNumberCode,
} from '../../../../../utils/helperFunctions';
import {
  renderCellText,
  renderDate,
  renderRowHoverAction,
  rowHoverActionColumnProps,
} from '../../../../Issues/utills/formatters';
import {
  getDataTypeInputValue,
  ValidationTypeInput,
} from '../../../../Managers/AgentManager/AgentEditor/utils/formatters';
import { VALIDATION_TYPES, VALIDATION_TYPE_PLACEHOLDERS } from '../../../../PublicFormPage/constants/validationTypes';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import EditableCell from '../../../../shared/REDISIGNED/table-v2/TableCells/EditableCell/EditableCell';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledEmptyValue,
  StyledFlex, StyledGrayIcon,
  StyledInlineFlex,
  StyledRowHoverText,
  StyledStatus,
  StyledSwitch,
  StyledText,
} from '../../../../shared/styles/styled';
import {
  GROUPED_VALIDATION_TYPES_OPTIONS,
  VALIDATION_TYPES_OPTIONS,
} from '../../../../WorkflowEditor/components/sideMenu/SideMenu/validationTypes';
import ServiceTypeIconPreview from '../components/shared/ServiceTypeIconPreview';
import { STATUSES_COLORS_OPTIONS } from '../constants/iconConstants';
import HiddenValue from '../components/shared/HiddenValue';
import SmsCanadaIcon from "../../../../../Assets/icons/smsCanada.svg?component";
import SmsUSAIcon from "../../../../../Assets/icons/smsUSA.svg?component";
import OrangePhoneIcon from "../../../../../Assets/icons/orangePhone.svg?component";

const renderSwitch = ({ cell, table }) => {
  const onUpdate = table.options.meta.updateServiceTicketType;
  return (
    <StyledFlex>
      <StyledSwitch
        type="checkbox"
        checked={cell.getValue()}
        onChange={(e) => {
          onUpdate({
            id: cell.row.original.id,
            isVisible: e.target.checked,
          });
        }}
      />
    </StyledFlex>
  );
};

const renderLink = ({ item, index, metaNavigate }) => (
  <StyledButton
    weight={600}
    variant="text"
    onClick={() =>
      metaNavigate({
        pathname: item.link,
        search: `?autoSearchAgent=${item.state?.name}`,
      })
    }
    alignSelf="flex-start"
    key={index}
    minWidth="auto"
  >
    {item.value}
  </StyledButton>
);

const renderChatWidgetsAgentColumn = (numLinesAllowed = 1, dataArray = [{ link: '', value: '' }], meta) => {
  const dataArrayLen = dataArray.length;

  const defaultViewData = dataArray.slice(0, numLinesAllowed);
  const showMoreData = dataArray.slice(numLinesAllowed);

  return renderShowMoreAgentsColumnWithLinks(numLinesAllowed, dataArrayLen, defaultViewData, showMoreData, meta);
};

const renderDefaultTableViewAgents = (defaultViewData, metaNavigate) =>
  defaultViewData.map((item, index) => renderLink({ item, index, metaNavigate }));

const renderShowMoreAgentsView = (defaultViewData, showMoreData, metaTheme, metaNavigate) => (
  <StyledFlex>
    {renderDefaultTableViewAgents(defaultViewData, metaNavigate)}
    <StyledTooltip
      title={
        <StyledFlex direction="column" gap="10px" padding="15px 20px">
          {showMoreData.map((item, index) => renderLink({ item, index, metaNavigate }))}
        </StyledFlex>
      }
      arrow
      placement="left"
      bgTooltip={metaTheme?.colors?.white}
      boxShadow={metaTheme?.boxShadows?.box}
      p="0"
    >
      <StyledText weight={600} cursor="pointer">
        +{showMoreData?.length} More
      </StyledText>
    </StyledTooltip>
  </StyledFlex>
);

const renderShowMoreAgentsColumnWithLinks = (numLinesAllowed, dataArrayLen, defaultViewData, showMoreData, meta) => {
  const metaTheme = meta?.theme;
  const metaNavigate = meta?.navigate;

  return (
    <StyledFlex>
      {dataArrayLen === 0 && <StyledEmptyValue />}

      {dataArrayLen !== 0 &&
        dataArrayLen < numLinesAllowed + 1 &&
        renderDefaultTableViewAgents(defaultViewData, metaNavigate)}

      {dataArrayLen !== 0 &&
        dataArrayLen >= numLinesAllowed + 1 &&
        renderShowMoreAgentsView(defaultViewData, showMoreData, metaTheme, metaNavigate)}
    </StyledFlex>
  );
};

const StyledNameColumn = styled(StyledFlex)`
  cursor: pointer;

  &:hover span {
    color: ${({ theme }) => theme.colors.linkColor};
  }
`;

const FieldNameAndIcon = ({ fieldName, toolTipTitle }) => (
  <StyledFlex direction="row" gap="5px">
    <StyledText as="span" size={15} weight={600}>
      {fieldName}
    </StyledText>
    <StyledFlex mt={0.4}>
      <StyledTooltip title={toolTipTitle} arrow placement="top" p="10px 15px" maxWidth="auto">
        <InfoOutlined sx={{ width: '17px', height: '17px' }} />
      </StyledTooltip>
    </StyledFlex>
  </StyledFlex>
);

export const SERVICE_TICKETS_TYPES_COLUMNS = [
  {
    header: 'Visible',
    accessorFn: (row) => row.isVisible, // TODO: update after BE team is able to provide clarification
    id: 'isVisible',
    Cell: ({ cell, table, ...props }) => renderSwitch({ cell, table, ...props }),
    size: 108,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Name',
    accessorFn: (row) => ({
      name: row.name,
      isDefault: row.isDefault,
    }),
    id: 'name',
    Cell: ({ cell, table, row }) => {
      const { name, isDefault } = cell.getValue();
      return (
        <StyledNameColumn onClick={() => table.options.meta.navigateToType(row.original)}>
          {renderCellText({ text: name, as: 'span' })}
          {isDefault &&
            renderCellText({
              text: 'Default',
              weight: 600,
              color: table.options.meta?.theme?.colors?.secondary,
            })}
        </StyledNameColumn>
      );
    },
    size: 225,
    align: 'left',
  },
  {
    header: 'Icon',
    accessorFn: (row) => row.icon,
    id: 'icon',
    Cell: ({ row }) => {
      const { iconColour, icon } = row.original;

      return <ServiceTypeIconPreview icon={icon} iconColour={iconColour} />;
    },
    size: 80,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'description',
    Cell: ({ cell, table }) => renderCellText({ text: cell.getValue() }),
    size: 339,
    align: 'left',
  },
  {
    header: 'Number of Tickets',
    accessorFn: (row) => row.issues,
    id: 'numOfTickets',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue()?.length || 0 }), // TODO: update after BE team is able to provide clarification
    size: 220,
    align: 'left',
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: ({ cell, table }) => renderDate({ cell, table }),
    size: 225,
    align: 'left',
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: ({ cell, table }) => renderDate({ cell, table }),
    size: 225,
    align: 'left',
  },
  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) => (
      <>
        {table.options.data.length > 1
          ? renderRowHoverAction({
              icon: <CustomTableIcons icon="BIN" width={25} />,
              onClick: () => table.options.meta?.onDeleteIcon(row.original),
            })
          : null}
      </>
    ),
    ...rowHoverActionColumnProps(),
  },
];

const frontOfficeTableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row.original),
    sx: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
};

const handleSwitchToggle = ({
  isChecked,
  setFieldValue,
  currentParameterName,
  rowData,
  setIsFullAddressFieldActivating,
  setIsAddressToggleWarningModalOpen,
  setShouldToggleAddressField,
  setAddressFieldActivating,
}) => {
  setAddressFieldActivating(currentParameterName);
  let updatedParameters = rowData;
  let isAddressFieldToggledOn;
  const STRING_FULL_ADDRESS = 'Full Address';

  if (isChecked) {
    if (currentParameterName === STRING_FULL_ADDRESS) {
      setIsFullAddressFieldActivating(true);
      isAddressFieldToggledOn = !rowData
        ?.filter((parameter) => parameter.name !== STRING_FULL_ADDRESS && parameter.name.includes('Address'))
        .every((parameter) => !parameter.isVisible);
    } else {
      setIsFullAddressFieldActivating(false);
      isAddressFieldToggledOn = rowData?.find((parameter) => parameter.name === STRING_FULL_ADDRESS)?.isVisible;
    }
    isAddressFieldToggledOn ? setIsAddressToggleWarningModalOpen(true) : setShouldToggleAddressField(true);
  } else {
    updatedParameters = rowData?.map((parameter) =>
      parameter.name === currentParameterName ? { ...parameter, isVisible: false } : parameter
    );
  }

  setFieldValue('parameters', updatedParameters);
};

export const CHAT_WIDGETS_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.name,
    id: 'name',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'description',
    Cell: ({ cell }) => (cell.getValue() ? renderCellText({ text: cell.getValue() }) : <StyledEmptyValue />),
    size: 300,
    enableSorting: false,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: ({ cell, table }) => renderDate({ cell, table }),
    size: 225,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: ({ cell, table }) => renderDate({ cell, table }),
    size: 225,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Assigned Agents',
    accessorFn: (row) => row.agents,
    id: 'agents',
    Cell: ({ cell, table }) => {
      const dataArray = cell.getValue()?.map((item) => ({
        value: item.name,
        link: routes.AGENT_MANAGER,
        state: {
          name: item.name,
        },
      }));

      const { meta } = table.options;
      return cell.getValue() ? renderChatWidgetsAgentColumn(3, dataArray, meta) : <StyledEmptyValue />;
    },
    size: 250,
    align: 'left',
    enableSorting: false,
  },
  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) =>
      renderRowHoverAction({
        icon: <CustomTableIcons icon="BIN" width={25} />,
        onClick: (event) => table.options.meta?.onDeleteIcon(row.original),
        toolTipTitle: 'Delete',
      }),
    ...rowHoverActionColumnProps(),
  },
];

const RenderEditableValue = ({
  row,
  cell,
  table,
  isMandatory = false,
  isFieldType = false,
  isDefaultValue = false,
  isMasked = false,
}) => {
  const renderCell = () => {
    if (isMandatory || isMasked) {
      return renderCellText({ text: cell.getValue() ? 'Yes' : 'No' });
    }

    if (!cell.getValue()) return <StyledEmptyValue />;

    if (isFieldType) {
      const typeLabel = VALIDATION_TYPES_OPTIONS.find(({ value }) => value === cell.getValue());
      return renderCellText({ text: typeLabel?.label ?? cell.getValue() });
    }

    if (isDefaultValue) {
      let text;

      if (row.type === VALIDATION_TYPES.FILE) {
        try {
          text = JSON.parse(cell.getValue()).name;
        } catch {
          return <StyledEmptyValue />;
        }
      } else if (row.type === VALIDATION_TYPES.DATE_OF_BIRTH) {
        return row.isMasked ? <HiddenValue /> : renderDate({ cell, table });
      } else {
        text = cell.getValue();
      }

      return row.isMasked ? <HiddenValue /> : renderCellText({ text });
    }

    return renderCellText({ text: cell.getValue() });
  };

  return (
    <EditableCell cell={cell} table={table} width="max-content">
      {renderCell()}
    </EditableCell>
  );
};

const renderHiddenValue = ({ cell, row, table }) => {
  const isDataTypeFile = row.original?.type === VALIDATION_TYPES.FILE;

  if (isDataTypeFile) {
    return (
      <StyledFlex direction="row" gap="8px" alignItems="center">
        <StyledText>N/A</StyledText>

        <StyledTooltip
          title={`The "Hidden" option does not apply to the selected File Type`}
          arrow
          placement="top"
          p="10px 15px"
          maxWidth="auto"
        >
          <InfoOutlined sx={{ width: '17px', height: '17px' }} />
        </StyledTooltip>
      </StyledFlex>
    );
  }

  return <RenderEditableValue cell={cell} table={table} isMasked />;
};

const EditAddFieldDefaultValue = ({ cell, table, row }) => {
  const { colors } = useTheme();

  const [value, setValue] = useState(cell.getValue());
  const { type, isMandatory, isMasked } = row.original;

  const handleDataTypeValueChange = (e) => {
    const newValue = getDataTypeInputValue(e, type);

    const isSingleSelectType = [
      VALIDATION_TYPES.FILE,
      VALIDATION_TYPES.ADDRESS,
      VALIDATION_TYPES.BOOLEAN,
      VALIDATION_TYPES.DATE_OF_BIRTH,
    ].includes(type);

    if (isSingleSelectType) handleBlur(newValue);

    setValue(newValue);
  };

  const handleBlur = (val) => {
    table.options.meta.onDefaultValueChange(row.original, val, cell.getValue());
    table.setEditingCell(null);
  };

  return (
    <StyledFlex
      p="0 8px"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleBlur(value);
        }
      }}
    >
      <ValidationTypeInput
        fieldValidationType={type}
        fieldCriteria={isMandatory ? 'M' : 'O'}
        fieldName="defaultValue"
        value={value}
        onChange={handleDataTypeValueChange}
        addressAutocompleteProps={{
          menuPortalTarget: document.body,
        }}
        inputFieldProps={{
          placeholder: cell.getValue() || VALIDATION_TYPE_PLACEHOLDERS?.[type] || 'Enter Value...',
        }}
        isProtected={isMasked}
        dobProps={{ menuPlacement: 'top' }}
        autoFocus
        inputBorderColor={colors.linkColor}
        onBlur={() => handleBlur(value)}
      />
    </StyledFlex>
  );
};

const getBooleanOptionsAndValue = (value) => {
  const selectBooleanOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const selectBooleanValue = selectBooleanOptions.find(({ label }) => label === value) || '';

  return { selectBooleanOptions, selectBooleanValue };
};

export const ADDITIONAL_FIELDS_COLUMNS = [
  {
    header: (
      <FieldNameAndIcon
        fieldName="Order"
        toolTipTitle="The order statuses appear in this table will determine the order they appear in when changing statuses on Service Ticket pages"
      />
    ),
    accessorFn: (row) => row.orderNumber,
    id: 'orderNumber',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    size: 108,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Visible',
    accessorFn: (row) => row?.isVisible,
    id: 'isVisible',
    Cell: ({ cell, row, table }) => {
      const currentParameterName = row.original.name;
      const rowData = table.options.data;
      const handleSwitchToggleProps = { currentParameterName, rowData, ...table.options.meta };

      return (
        <StyledFlex>
          <StyledSwitch
            type="checkbox"
            checked={cell.getValue()}
            onChange={(e) => handleSwitchToggle({ isChecked: e.target.checked, ...handleSwitchToggleProps })}
          />
        </StyledFlex>
      );
    },
    size: 92,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },

  {
    header: 'Field Name',
    accessorFn: (row) => row.name,
    id: 'name',
    Cell: ({ cell, row, table }) =>
      row.original.id ? <RenderEditableValue cell={cell} table={table} /> : renderCellText({ text: cell.getValue() }),
    Edit: ({ cell, table, row }) => {
      const { colors } = useTheme();

      const [value, setValue] = useState(cell.getValue());

      if (row.original.id) {
        return (
          <StyledFlex p="0 8px">
            <BaseTextInput
              placeholder={value}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => table.setEditingCell(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  table.options.meta.onNameChange(row.original, value);
                  table.setEditingCell(null);
                }
              }}
              borderColor={colors.linkColor}
              fontSize="14px"
              autoFocus
            />
          </StyledFlex>
        );
      }
      return renderCellText({ text: cell.getValue() });
    },
    size: 259,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Origin',
    accessorFn: (row) => row.isPreset,
    id: 'isPreset',
    Cell: ({ cell }) => {
      const text = cell.getValue() ? 'Preset' : 'Custom';
      const color = cell.getValue() ? 'blue' : 'red';

      return (
        <StyledFlex maxWidth="80px" alignItems="center" justifyContent="center">
          <StyledStatus height="34px" minWidth="80px" color={color}>
            {text}
          </StyledStatus>
        </StyledFlex>
      );
    },
    size: 131,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Data Type',
    accessorFn: (row) => row.type,
    id: 'type',
    Cell: ({ cell, row, table }) => {
      if (row.original.id) {
        return <RenderEditableValue cell={cell} table={table} isFieldType />;
      }
      const typeLabel = VALIDATION_TYPES_OPTIONS.find(({ value }) => value === cell.getValue());
      return renderCellText({ text: typeLabel?.label ?? cell.getValue() });
    },
    Edit: ({ cell, table, row }) => {
      const { colors } = useTheme();

      const typeLabel = VALIDATION_TYPES_OPTIONS.find(({ value }) => value === cell.getValue());
      const selectedOption = { label: typeLabel?.label, value: cell.getValue() };
      const [value, setValue] = useState([selectedOption]);
      if (row.original.id) {
        return (
          <StyledFlex p="0 8px">
            <CustomSelect
              name="type"
              menuIsOpen
              autoFocus
              menuPlacement="auto"
              options={GROUPED_VALIDATION_TYPES_OPTIONS}
              placeholder="Select Field Type"
              value={value}
              closeMenuOnSelect
              isClearable={false}
              isSearchable={false}
              onChange={(val) => {
                setValue([val]);
                table.options.meta.onFieldTypeChange(row.original, val.value);
                table.setEditingCell(null);
              }}
              onBlur={() => table.setEditingCell(null)}
              components={{ DropdownIndicator: CustomIndicatorArrow }}
              maxHeight={30}
              menuPadding={0}
              form
              menuPortalTarget={document.body}
              borderColor={colors.linkColor}
            />
          </StyledFlex>
        );
      }
      return renderCellText({ text: typeLabel?.label ?? cell.getValue() });
    },
    size: 150,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: true,
  },
  {
    header: (
      <FieldNameAndIcon
        fieldName="Required"
        toolTipTitle="Determines whether the field is required to be filled in on the Service Ticket page"
      />
    ),
    accessorFn: (row) => row.isMandatory,
    id: 'isMandatory',
    Cell: ({ cell, table }) => <RenderEditableValue cell={cell} table={table} isMandatory />,
    Edit: ({ cell, table, row }) => {
      const { colors } = useTheme();

      const [value, setValue] = useState(cell.getValue() ? 'Yes' : 'No');

      const { selectBooleanOptions, selectBooleanValue } = getBooleanOptionsAndValue(value);

      return (
        <StyledFlex p="0 8px">
          <CustomSelect
            name="required"
            menuIsOpen
            autoFocus
            menuPlacement="auto"
            options={selectBooleanOptions}
            value={selectBooleanValue}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            onChange={(val) => {
              setValue([val]);
              table.options.meta.onMandatoryHiddenChange(row.original, val.value);
              table.setEditingCell(null);
            }}
            onBlur={() => table.setEditingCell(null)}
            components={{ DropdownIndicator: CustomIndicatorArrow }}
            maxHeight={30}
            menuPadding={0}
            form
            menuPortalTarget={document.body}
            borderColor={colors.linkColor}
          />
        </StyledFlex>
      );
    },
    size: 133,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: true,
  },
  {
    header: (
      <FieldNameAndIcon
        fieldName="Hidden"
        toolTipTitle="Determines whether the field value will be hidden from the user on the Service Ticket page"
      />
    ),
    accessorFn: (row) => row.isMasked,
    id: 'isMasked',
    Cell: ({ cell, table, row }) =>
      renderHiddenValue({
        cell,
        row,
        table,
      }),
    Edit: ({ cell, table, row }) => {
      const { colors } = useTheme();

      const [value, setValue] = useState(cell.getValue() ? 'Yes' : 'No');

      const { selectBooleanOptions, selectBooleanValue } = getBooleanOptionsAndValue(value);

      return (
        <StyledFlex p="0 8px">
          <CustomSelect
            name="hidden"
            menuIsOpen
            autoFocus
            menuPlacement="auto"
            options={selectBooleanOptions}
            value={selectBooleanValue}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            onChange={(val) => {
              setValue([val]);
              table.options.meta.onMandatoryHiddenChange(row.original, val.value, true);
              table.setEditingCell(null);
            }}
            onBlur={() => table.setEditingCell(null)}
            components={{ DropdownIndicator: CustomIndicatorArrow }}
            maxHeight={30}
            menuPadding={0}
            form
            menuPortalTarget={document.body}
            borderColor={colors.linkColor}
          />
        </StyledFlex>
      );
    },
    size: 133,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: true,
  },
  {
    header: 'Default Value',
    accessorFn: (row) => row.defaultValue,
    id: 'defaultValue',
    Cell: ({ row, cell, table }) => <RenderEditableValue row={row.original} cell={cell} table={table} isDefaultValue />,
    Edit: ({ cell, table, row }) => <EditAddFieldDefaultValue cell={cell} table={table} row={row} />,
    size: 259,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: true,
  },
  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) =>
      table.options.data.length > 1 && row.original.id
        ? renderRowHoverAction({
            icon: <CustomTableIcons icon="BIN" width={25} />,
            onClick: () => table.options.meta?.onFieldDelete(row.original),
          })
        : null,
    ...rowHoverActionColumnProps(),
    enableEditing: false,
  },
];

export const TICKET_TYPE_STATUSES_COLUMNS = [
  {
    header: (
      <FieldNameAndIcon
        fieldName="Order"
        toolTipTitle="The order statuses appear in this table will determine the order they appear in when changing statuses on Service Ticket pages"
      />
    ),
    accessorFn: (row) => row.orderNumber,
    id: 'orderNumber',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    size: 108,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => ({
      name: row.name,
      colour: row.colour,
    }),
    id: 'name',
    Cell: ({ cell, table, row }) => {
      const { name, colour } = cell.getValue();
      const colorOption = STATUSES_COLORS_OPTIONS[colour];

      return (
        <EditableCell
          cell={cell}
          table={table}
          width="max-content"
          onClick={() => table.options.meta.onStatusChangeClick(row.original)}
        >
          <StyledStatus height="34px" minWidth="auto" textColor={colorOption.primary} bgColor={colorOption.secondary}>
            {name}
          </StyledStatus>
        </EditableCell>
      );
    },
    size: 219,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Associated Behaviours',
    accessorFn: (row) => row.defaultValue,
    id: 'defaultValue',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() || '---' }),
    size: 259,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Number of Tickets Using This Status',
    accessorFn: (row) => row.name,
    id: 'isMandatory',
    Cell: ({ cell, table }) => {
      const issueCount = table.options.meta.issues?.filter((issue) => issue.status === cell.getValue())?.length ?? 0;

      return renderCellText({ text: issueCount });
    },
    size: 157,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) =>
      table.options.data.length > 1
        ? renderRowHoverAction({
            icon: <CustomTableIcons icon="BIN" width={25} />,
            onClick: () => table.options.meta?.onStatusDelete(row.original),
          })
        : null,
    ...rowHoverActionColumnProps(),
  },
];

export const PHONE_NUMBER_MANAGEMENT_COLUMNS = [
  {
    header: 'Phone Number',
    accessorFn: (row) => row.phoneNumber,
    id: 'phoneNumber',
    Cell: ({ cell }) => (
      <StyledFlex ml={3}>
        <StyledRowHoverText>
          <StyledText size={15}>{formatPhoneNumber(cell.getValue())}</StyledText>
        </StyledRowHoverText>
      </StyledFlex>
    ),
    size: 275,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Location',
    accessorFn: (row) => row.country,
    id: 'country',
    Cell: ({ row }) => (
      <StyledFlex>
        <StyledInlineFlex>
          <StyledText weight={600}>Country: </StyledText>
          &nbsp;
          <StyledText>
            {row.original.country} {formatPhoneNumberCode(row.original.phoneNumber)}
          </StyledText>
        </StyledInlineFlex>
        <StyledInlineFlex>
          <StyledText weight={600}>Province: </StyledText>
          &nbsp;
          <StyledText>{row.original.province}</StyledText>
        </StyledInlineFlex>
        <StyledInlineFlex>
          <StyledText weight={600}>Area Code: </StyledText>
          &nbsp;
          <StyledText>{capitalizeFirstLetterOfRegion(row.original.areaCode)}</StyledText>
        </StyledInlineFlex>
      </StyledFlex>
    ),
    size: 275,
    enableSorting: false,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Capabilities',
    accessorFn: (row) => row.createdDate,
    id: 'capabilities',
    Cell: ({ row }) => {
      const { receivePhoneCall, smsSendCanada, smsSendUsa } = row.original;

      const renderTitle = ({ text, isEnabled }) => {
        const status = isEnabled ? 'On' : 'Off';

        return (
          <StyledFlex>
            <StyledText themeColor="white" textAlign="center" size={14} weight={600}>{text}: {status}</StyledText>
            {!isEnabled && <StyledText wrap="nowrap" themeColor="white" size={14} textAlign="center">Contact Customer Support to Enable This Feature</StyledText>}
          </StyledFlex>
        );
      }

      return (
        <StyledFlex direction="row" alignItems="center" gap="20px">
          <StyledTooltip title={renderTitle({ text: 'Receive Phone Calls', isEnabled: receivePhoneCall })} arrow placement="top" p="10px 15px" maxWidth="100%">
            <StyledGrayIcon disabled={!receivePhoneCall}><OrangePhoneIcon /></StyledGrayIcon>
          </StyledTooltip>
          <StyledTooltip title={renderTitle({ text: 'Send SMS (Canada)', isEnabled: smsSendCanada })} arrow placement="top" p="10px 15px" maxWidth="100%">
            <StyledGrayIcon disabled={!smsSendCanada}><SmsCanadaIcon /></StyledGrayIcon>
          </StyledTooltip>
          <StyledTooltip title={renderTitle({ text: 'Send SMS (USA)', isEnabled: smsSendUsa })} arrow placement="top" p="10px 15px" maxWidth="100%">
            <StyledGrayIcon disabled={!smsSendUsa}><SmsUSAIcon /></StyledGrayIcon>
          </StyledTooltip>
        </StyledFlex>
      );
    },
    size: 275,
    enableSorting: false,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Date Created',
    accessorFn: (row) => row.createdDate,
    id: 'createdDate',
    Cell: ({ cell, table }) => renderDate({ cell, table }),
    size: 200,
    align: 'left',
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Assigned Agents',
    accessorFn: (row) => row.associatedAgentId,
    id: 'agent.name',
    Cell: ({ row, table }) => {
      if (!row.original.agents) {
        return <StyledEmptyValue />;
      }
      const dataArray = row.original?.agents?.map((item) => ({
        value: item.name,
        link: routes.AGENT_MANAGER,
        state: {
          name: item.name,
        },
      }));

      const { meta } = table.options;

      return renderChatWidgetsAgentColumn(1, dataArray, meta);
    },
    size: 300,
    align: 'left',
    enableSorting: true,
    ...frontOfficeTableRowClick,
  },
  {
    header: 'Number of Processes',
    accessorFn: (row) => row.workflowIds,
    id: 'workflowIds',
    Cell: ({ row }) => {
      const workFlowIdsArrayLength = row.original.workflowIds.length;
      return <StyledFlex>{workFlowIdsArrayLength > 0 ? workFlowIdsArrayLength : '---'}</StyledFlex>;
    },
    size: 225,
    align: 'left',
    ...frontOfficeTableRowClick,
  },

  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) =>
      renderRowHoverAction({
        icon: <CustomTableIcons icon="BIN" width={25} />,
        onClick: (event) => table.options.meta?.onDeleteIcon(row.original),
        toolTipTitle: 'Delete',
      }),
    ...rowHoverActionColumnProps(),
  },
];
