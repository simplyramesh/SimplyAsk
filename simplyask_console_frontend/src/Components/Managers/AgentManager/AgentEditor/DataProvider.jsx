import { useParams } from 'react-router-dom';
import useAgentDetails from './hooks/useAgentDetails';

const DataProvider = ({ children }) => {
  const { serviceTypeId } = useParams();

  const { isAgentLoading } = useAgentDetails(serviceTypeId);

  return children(isAgentLoading);
};

export default DataProvider;
