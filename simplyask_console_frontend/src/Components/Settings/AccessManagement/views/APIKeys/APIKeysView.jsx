import { StyledCard } from '../../../../shared/styles/styled';
import APIKeysTable from '../../components/APIKeysTable/APIKeysTable';

const APIKeysView = () => {
  return (
    <>
      <StyledCard>
        <APIKeysTable />
      </StyledCard>
    </>
  );
};

export default APIKeysView;
