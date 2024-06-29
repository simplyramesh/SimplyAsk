import { StyledFlex } from '../../../shared/styles/styled';
import EmptyTable from '../../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';

const MESSAGE = 'There are no results based on your current search. Try again with different words.';

const EmptyProductOfferings = () => (
  <StyledFlex direction="row" justifyContent="center" alignItems="center" flex="1 1 auto">
    <EmptyTable title="Results" icon="SEARCH" message={MESSAGE} />
  </StyledFlex>
);
export default EmptyProductOfferings;
