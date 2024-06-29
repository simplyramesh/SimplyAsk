import styled from '@emotion/styled';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { capitalizeFirstLetterOfRegion } from '../../../../../utils/helperFunctions';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledFlex } from '../../../../shared/styles/styled';



const StyledFlexResponsiveWrapper = styled(StyledFlex)`
  @media only screen and (max-width: 1300px) { 
    grid-template-columns: 1fr 1fr;

    & > div:nth-of-type(2) {
      grid-row: 2/2;
      grid-column: 1/2;
    }

    & > div:nth-of-type(4) {
      grid-column: 2/2;
      grid-row: 1/2;
    }
  }
`;

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  minMenuWidth: 340,
  closeMenuOnSelect: true,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
  height: 34,
  minHeight: 34,
  maxHeight: 34,
  mb: 0,
  menuPortalTarget: document.body,
  placeholderFontSize: 15,
  singleValueFontSize: 15,
};

const dateCreateRadioLabel = [
  {
    label: 'Date Created',
    value: ['createdBefore', 'createdAfter'],
    default: true,
  },
]

const AgentManagerModalPhoneNumberFilters
 = ({
   initialValues = {},
   onApplyFilters = () => { },
   onSearch,
   searchText,
   phoneNumberManagementData,
 }) => {
   const {
     values, setFieldValue, submitForm, dirty,
   } = useFormik({
     enableReinitialize: true,
     initialValues,
     onSubmit: (val, meta) => {
       onApplyFilters(val);
       meta.resetForm(initialValues);
     },
   });

   useEffect(() => {
     if (dirty) {
       submitForm();
     }
   }, [values, dirty]);


   const locationDropDownOptions = () => {
     let result = [];

     phoneNumberManagementData?.content?.forEach((item) => {
       if (!item.associatedAgentId) {
         if (item.country && !result.some(obj => obj.label === item.country)) {
           result.push({ label: item.country, value: item.country });
         }

         if (item.province) {
           const provinceLabel = `${item.province} ${item.country}`;
           if (!result.some(obj => obj.label === provinceLabel)) {
             result.push({ label: provinceLabel, value: provinceLabel });
           }
         }

         if (item.region) {
           const regionLabel = `${capitalizeFirstLetterOfRegion(item.region)} ${item.province} ${item.country}`;
           if (!result.some(obj => obj.label === regionLabel)) {
             result.push({ label: regionLabel, value: `${item.region} ${item.province} ${item.country}` });
           }
         }
       }
     });

     return result;
   };

   const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

   return (
     <StyledFlexResponsiveWrapper gap="15px" alignItems="center" display="grid" gridTemplateColumns="1fr 1fr 1fr">
       <SearchBar
         placeholder="Search Numbers..."
         onChange={onSearch}
         width="100%"
         fontSize={15}
         value={searchText}
       />
       <CustomSelect
         name="createdDate"
         value={values.createdDate}
         onChange={handleDropdownFilterChange}
         placeholder="Date Created"
         components={{
           DropdownIndicator: CustomCalendarIndicator,
           Menu: CustomCalendarMenu,
         }}
         isSearchable={false}
         {...sharedDropdownProps}
         radioLabels={dateCreateRadioLabel}
         showDateFilterType={false}
         menuWidth="555px"
         menuRightPosition={1}
       />
       <CustomSelect
         name="location"
         options={locationDropDownOptions() ?? []}
         value={values.location}
         onChange={handleDropdownFilterChange}
         placeholder="Select Location..."
         components={{
           DropdownIndicator: CustomIndicatorArrow,
         }}
         isSearchable
         {...sharedDropdownProps}
         maxMenuHeight={400}
         withSeparator
       />

     </StyledFlexResponsiveWrapper>
   );
 };

export default AgentManagerModalPhoneNumberFilters;
