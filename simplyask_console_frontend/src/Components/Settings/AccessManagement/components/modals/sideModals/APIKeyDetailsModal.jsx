import InfoList from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledText } from '../../../../../shared/styles/styled';
import { DateCreatedColumn, ValueColumn } from '../../APIKeysTable/utils/APIKeysTableColumnsFormatter';

const APIKeyDetailsModal = ({ viewAPIKey, onClose }) => {
  return (
    <CustomSidebar
      width={720}
      open={!!viewAPIKey}
      onClose={onClose}
      headerTemplate={<StyledText size={36} lh={42} weight={600}>{viewAPIKey?.name}</StyledText>}
    >
      {() => (
        <InfoList p="16px">
          <InfoListGroup>
            <InfoListItem name="Value"><ValueColumn keyValue={viewAPIKey?.value} /></InfoListItem>
            <InfoListItem name="Date Created"><DateCreatedColumn value={viewAPIKey?.createdDate} /></InfoListItem>
          </InfoListGroup>
        </InfoList>
      )}
    </CustomSidebar>
  );
};

export default APIKeyDetailsModal;
