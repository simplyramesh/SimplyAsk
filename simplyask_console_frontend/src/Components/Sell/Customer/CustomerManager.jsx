import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import GoACustomerTable from '../Orders/govOfAlberta/components/GoACustomer/GoACustomerTable';
import { GOVERNMENT_OF_ALBERTA } from '../Orders/ProductOfferings/ProductOfferings';

import CustomerTable from './CustomerTable/CustomerTable';

const CustomerManager = () => {
  const { currentUser } = useGetCurrentUser();

  const renderCustomerTable = () => {
    switch (currentUser?.organization?.name) {
    case GOVERNMENT_OF_ALBERTA:
      return <GoACustomerTable />;
    default:
      return <CustomerTable />;
    }
  };

  return renderCustomerTable();
};

export default CustomerManager;
