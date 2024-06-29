import PropTypes from 'prop-types';
import { Card } from 'simplexiar_react_components';

import classes from './InfoTab.module.css';

const InfoTab = ({ person }) => {
  const emptyCheck = (val) => {
    if (!val) return '---';
    return val;
  };

  return (
    <Card className={classes.card}>
      <h3>Full Name</h3>
      <p>
        {emptyCheck(person.contactInformation.first_name)}
        {' '}
        {emptyCheck(person.contactInformation.last_name)}
      </p>
      <h3>Email</h3>
      <p>{emptyCheck(person.contactInformation.email)}</p>
      <h3>Phone Number</h3>
      <p>{emptyCheck(person.contactInformation.phone_number)}</p>
      <h3>Address</h3>
      <p>{emptyCheck(person.addressInformation.address)}</p>
      <h3>Pincode</h3>
      <p>{emptyCheck(person.addressInformation.zipcode)}</p>
    </Card>
  );
};

export default InfoTab;

InfoTab.propTypes = {
  person: PropTypes.shape({
    addressInformation: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      formattedAddress: PropTypes.string,
      fullAddress: PropTypes.string,
      postalCode: PropTypes.string,
      province: PropTypes.string,
      streetFullAddress: PropTypes.string,
      streetName: PropTypes.string,
      streetNumber: PropTypes.string,
      address: PropTypes.string,
      zipcode: PropTypes.string,
    }),
    contactInformation: PropTypes.shape({
      email: PropTypes.string,
      first_name: PropTypes.string,
      fullName: PropTypes.string,
      last_name: PropTypes.string,
      personId: PropTypes.string,
      phone_number: PropTypes.string,
    }),
    enabled: PropTypes.bool,
    id: PropTypes.string,
    organizationId: PropTypes.string,
  }),
};
