import { useQuery } from '@tanstack/react-query';
import { getNumEmployeesOptions } from '../../../../../Services/axios/billing';

export const GET_NUMBER_OF_EMPLOYEES = 'GET_NUMBER_OF_EMPLOYEES';

const useGetNumberOfEmployees = (rest = {}) => {
  const { data: employeesNumDataOptions, isFetching: isFetchingEmployees } = useQuery({
    queryKey: [GET_NUMBER_OF_EMPLOYEES],
    queryFn: getNumEmployeesOptions,
    ...rest,
  });

  return { employeesNumDataOptions, isFetchingEmployees };
};

export default useGetNumberOfEmployees;
