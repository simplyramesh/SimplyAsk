import { useEffect, useState } from 'react';

const useFilteredPhoneNumbers = (availableNumbers, phoneNumberValue) => {
  const [filteredAvailableNumbers, setFilteredAvailableNumbers] = useState([]);
  const selectedPhoneNumber =
    phoneNumberValue && phoneNumberValue.value ? phoneNumberValue : null;

  useEffect(() => {
    const filteredPhoneNumbers = availableNumbers.filter(
      (phoneNumber) => phoneNumber?.value !== selectedPhoneNumber?.value
    );
    setFilteredAvailableNumbers(filteredPhoneNumbers);
  }, [availableNumbers, phoneNumberValue]);

  return [filteredAvailableNumbers, selectedPhoneNumber];
};

export default useFilteredPhoneNumbers;
