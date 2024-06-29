import Switch from "../../../../../../SwitchWithText/Switch"
import { StyledDivider, StyledFlex, StyledText } from "../../../../../../shared/styles/styled"
import RadioInput from "../../../../../AccessManagement/components/inputs/radio/RadioInput"
import { USER_IDENTIFICATION_BLOCK } from "../../../constants/defaultAgentAdvanceSettingsConstants"
import CollectUserInfoTable from "../CollectUserInfoTable/CollectUserInfoTable"
import { useTheme } from '@mui/material/styles';
import { StyledUserInfoCollectCard } from "../StyledDefaultAgentAdvancedSettings"

const UserIdentification = ({
  agentConfig,
  onChange,
  isPanelView = false
}) => {
  const { colors } = useTheme();

  const UserCollectCard = ({
    fullWidth = false,
    isChecked,
    onClick,
    value,
    title,
    description,
  }) => {
    return (
      <StyledUserInfoCollectCard
        p="20px"
        width={fullWidth ? '100%' : '330px'}
        borderRadius="10px"
        isChecked={isChecked}
        onClick={onClick}
      >
        <StyledFlex
          display="flex"
          gap="8px"
          alignItems="flex-start"
        >
          <StyledFlex
            display="flex"
            flexDirection="row"
            gap="6px"
          >
            <RadioInput
              checked={isChecked}
              value={value}
              readOnly
              withButton
            />
            <StyledText weight="600" width="240px" height="17px">{title}</StyledText>
          </StyledFlex>
          <StyledText height="42px">
            {description}
          </StyledText>
        </StyledFlex>
      </StyledUserInfoCollectCard>)
  }

  return (
    <>
      <StyledFlex
        display="flex"
        gap="8px"
        maxWidth="800px"
        alignSelf="stretch"
        alignItems="flex-start"
      >
        <StyledText
          size="19"
          lh="29"
          weight="600"
        >
          User Identification
        </StyledText>

        <StyledText
          size="16"
          lh="24"
        >
          Configure what information is collected from users. The collected information is used in the People, Conversation History, and Live Chat pages.
        </StyledText>
      </StyledFlex>

      <StyledFlex
        display="flex"
        gap="15px"
        alignSelf="stretch"
        alignItems="flex-start"
        mt="30px"
      >
        <StyledText lh="24" weight="600" >How Would You Like User Information to be Collected?</StyledText>
        <StyledFlex
          display="flex"
          width="100%"
          gap="20px"
          alignItems="flex-start"
          direction={isPanelView ? 'column' : 'row'}
        >
          <UserCollectCard
            fullWidth={isPanelView}
            isChecked={agentConfig.collectionOption === USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_TRANSFER_REQUEST}
            onClick={() => onChange({
              collectionOption: USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_TRANSFER_REQUEST
            })}
            title="Upon Transfer Request"
            description="Only collect information if the user requests to be transferred."
            value={agentConfig.collectionOption}
          />

          <UserCollectCard
            fullWidth={isPanelView}
            isChecked={agentConfig.collectionOption === USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_START_OF_CONVERSION}
            onClick={() => onChange({
              collectionOption: USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_START_OF_CONVERSION
            })}
            title="Upon Start Of Conversation"
            description="Only collect information at the start of a new conversation. "
            value={agentConfig.collectionOption}
          />

          <UserCollectCard
            fullWidth={isPanelView}
            isChecked={agentConfig.collectionOption === USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.NEVER_COLLECT}
            onClick={() => onChange({
              collectionOption: USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.NEVER_COLLECT
            })}
            title="Never Collect"
            description="No information will be automatically collected."
            value={agentConfig.collectionOption}
          />
        </StyledFlex>
      </StyledFlex>
      {
        agentConfig.collectionOption !== USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.NEVER_COLLECT &&
          <StyledDivider color={colors.platinum} m="30px 0px" borderWidth={1.5} orientation="horizontal" />
      }
      <UserInfoCollectionOptions
        agentConfig={agentConfig}
        onChange={onChange}
      />
      {
        agentConfig.collectionOption !== USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.NEVER_COLLECT &&
          <CollectUserInfoTable
            agentConfig={agentConfig}
            onChange={onChange}
          />
      }
    </>
  )
}

const UserInfoCollectionOptions = ({
  agentConfig,
  onChange,
}) => {
  return (
    <StyledFlex
      display="flex"
      gap="15px"
      alignItems="flex-start"
      alignSelf="stretch"
    >
      {agentConfig.collectionOption === USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_TRANSFER_REQUEST
          && (
            <>
              <StyledText width="100%" weight="600">
                Select User Information to be Collected
              </StyledText>
              <StyledFlex
                display="flex"
                alignItems="flex-start"
                gap="12px"
                maxWidth="820px"
              >
                <StyledFlex
                  display="flex"
                  gap="10px"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Switch
                    checked={agentConfig.autoIdentifyUserInfo}
                    activeLabel=""
                    inactiveLabel=""
                    onChange={() => onChange({
                      autoIdentifyUserInfo: !agentConfig.autoIdentifyUserInfo
                    })}
                  />
                  <StyledText
                    weight="500"
                    textAlign="right"
                    width="250px"
                  >
                    Auto-Identify User Information
                  </StyledText>
                </StyledFlex>
                <StyledText
                  size="14"
                  lh="21"
                >
                  Automatically recognizes and collects the selected user information if it was mentioned in a conversation.
                  <StyledText display="inline" weight="600" size="14">Note: </StyledText>
                  This feature is intended for conversations where only the desired end-user is mentioned. It is not meant for
                  conversations where multiple people are referenced, as it may result in the wrong user information being collected.
                </StyledText>
              </StyledFlex>
            </>
          )}

      {agentConfig.collectionOption === USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_START_OF_CONVERSION &&
        <StyledText weight="600"> Select User Information to Collect</StyledText>
      }
    </StyledFlex>
  )
}

export default UserIdentification