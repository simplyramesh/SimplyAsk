import { InfoOutlined } from '@mui/icons-material';
import React, { memo } from 'react';
import { useGetAllAgents } from '../../../../../ConverseDashboard/hooks/useGetAllAgents';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../shared/styles/styled';

const TransferToAgent = ({ data, onChange, error }) => {
  const { allAgents: allAgentsOptions, isAllAgentsLoading } = useGetAllAgents(
    new URLSearchParams({
      pageSize: 999,
    }),
    {
      cacheTime: Infinity,
      gcTime: Infinity,
      select: (res) =>
        res?.content?.map((item) => ({
          label: item.name,
          value: item.agentId,
        })),
    }
  );

  if (isAllAgentsLoading) return <Spinner inline small />;

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel label="Target Agent" name="targetAgent" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        <StyledTooltip arrow placement="top" title="Select another existing Agent to transfer to" p="10px 15px">
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <CustomSelect
        menuPlacement="auto"
        placeholder="Select Agent"
        options={allAgentsOptions}
        getOptionValue={({ value }) => value}
        closeMenuOnSelect
        isClearable={false}
        isSearchable
        value={allAgentsOptions?.find((option) => option.value === data.agentId)}
        onChange={({ value }) => onChange(value, ['data', 'agentId'])}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Option: IconOption,
        }}
        maxHeight={30}
        menuPadding={0}
        controlTextHidden
        menuPortalTarget={document.body}
        form
        withSeparator
        invalid={error}
      />
    </StyledFlex>
  );
};

export default memo(TransferToAgent);
