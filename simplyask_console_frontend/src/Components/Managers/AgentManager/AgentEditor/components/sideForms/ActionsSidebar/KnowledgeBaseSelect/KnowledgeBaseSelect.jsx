import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import PencilEditIcon from '../../../../../../../../Assets/icons/pencilEditIcon.svg?component';
import routes from '../../../../../../../../config/routes';
import useGetKnowledgeBases from '../../../../../../../Settings/Components/General/components/SimplyAssistantKnowledgeBases/hooks/useGetKnowledgeBases';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../../../shared/styles/styled';

const KnowledgeBaseSelect = ({
  value,
  onChange,
  invalid,
  hasManage = true,
  toolTipText = 'Knowledge Base',
  ...rest
}) => {
  const { knowledgeBases, isFetching } = useGetKnowledgeBases();

  const options =
    knowledgeBases?.content?.map(({ knowledgeBaseId, name }) => ({
      label: name,
      value: knowledgeBaseId,
    })) || [];

  if (isFetching) return <Spinner inline small />;

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel
          label="Knowledge Base"
          name="knowledgeBase"
          isOptional={false}
          size={15}
          weight={600}
          mb={0}
          lh={24}
        />
        <StyledTooltip arrow placement="top" title={toolTipText} p="10px 15px">
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <StyledFlex gap="10px">
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select Knowledge Base(s)..."
          options={options}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable
          value={options?.find(({ value: val }) => val === value)}
          onChange={({ value }) => onChange(value)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          invalid={invalid}
          {...rest}
        />
        {hasManage && (
          <StyledButton
            variant="text"
            onClick={() => window.open(routes.SETTINGS_GENERAL_TAB, '_blank')}
            startIcon={<PencilEditIcon style={{ height: '14px', width: '14px' }} />}
            alignSelf="flex-start"
          >
            Manage Knowledge Bases
          </StyledButton>
        )}
      </StyledFlex>
    </StyledFlex>
  );
};

export default KnowledgeBaseSelect;
