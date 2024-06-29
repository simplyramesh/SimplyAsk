import PropTypes from 'prop-types';

const DarkHorizontalLine = ({ dhlClassName }) => {
  return <div className={dhlClassName} />;
};

export default DarkHorizontalLine;

DarkHorizontalLine.propTypes = {
  dhlClassName: PropTypes.string,
};
