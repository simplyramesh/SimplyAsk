import PropTypes from 'prop-types';

const LightHorizontalLine = ({ lhlClassName }) => {
  return <div className={lhlClassName} />;
};

export default LightHorizontalLine;

LightHorizontalLine.propTypes = {
  lhlClassName: PropTypes.string,
};
