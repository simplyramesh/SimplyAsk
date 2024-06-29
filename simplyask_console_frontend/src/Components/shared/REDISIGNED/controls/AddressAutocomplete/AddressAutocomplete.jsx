import { useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

import CustomSelect from '../../selectMenus/CustomSelect';
import LoadingMessage from './LoadingMessage';
import NoOptionsMessage from './NoOptionsMessage';
import AddressSingleValue from './AddressSingleValue';
import InputVisibilityToggleIndicator from './InputVisibilityToggleIndicator';

const AddressAutocomplete = ({ value, onChange, placeholder, country, invalid, ...props }) => {
  const [inputValue, setInputValue] = useState('');

  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: import.meta.env.VITE_PLACES_API_KEY,
    debounce: 500,
    options: {
      types: ['premise', 'subpremise', 'street_address', 'route'],
      ...(country ? { componentRestrictions: { country } } : {}),
    },
  });

  const findAddressComponent = (addressComponents, type) =>
    addressComponents.find((addrComp) => addrComp.types.indexOf(type) !== -1)?.long_name ?? '';

  return (
    <CustomSelect
      options={placePredictions}
      inputValue={inputValue || ''}
      onInputChange={(val) => {
        getPlacePredictions({ input: val });
        setInputValue(val);
      }}
      placeholder={placeholder}
      value={{ description: value }}
      onChange={(val) => {
        if (!val) return;

        placesService?.getDetails(
          {
            placeId: placePredictions[0].place_id,
          },
          (placeDetails) => {
            const streetNumber =
              findAddressComponent(placeDetails.address_components, 'street_number') ||
              findAddressComponent(placeDetails.address_components, 'subpremise');

            const newAddress = {
              address: val.description,
              country: findAddressComponent(placeDetails.address_components, 'country'),
              province: findAddressComponent(placeDetails.address_components, 'administrative_area_level_1'),
              city: findAddressComponent(placeDetails.address_components, 'locality'),
              postalCode: findAddressComponent(placeDetails.address_components, 'postal_code'),
              street:
                (streetNumber ? `${streetNumber} ` : '') +
                findAddressComponent(placeDetails.address_components, 'route'),
            };

            onChange?.(newAddress);
          }
        );
      }}
      isLoading={isPlacePredictionsLoading}
      invalid={invalid}
      form
      closeMenuOnSelect
      closeMenuOnScroll
      getOptionLabel={(option) => option.description}
      getOptionValue={(option) => option.description}
      components={{
        DropdownIndicator: InputVisibilityToggleIndicator,
        NoOptionsMessage,
        LoadingMessage,
        SingleValue: AddressSingleValue,
      }}
      {...props}
    />
  );
};

export default AddressAutocomplete;
