import CustomSelect from '../../selectMenus/CustomSelect';

const TagsInput = ({ ...props }) => {
  return (
    <CustomSelect
      isMulti
      isCreatable
      form
      noOptionsMessage={() => 'Please type something to create'}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeprartor: () => null,
      }}
      menuPortalTarget={document.body}
      { ...props }
    />
  );
};

export default TagsInput;
