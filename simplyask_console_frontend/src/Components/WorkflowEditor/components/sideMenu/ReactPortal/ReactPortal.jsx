import PropTypes from 'prop-types';
import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const createWrapperAndAppendToBody = (wrapperId) => {
  const wrapper = document.createElement('div');
  wrapper.id = wrapperId;
  document.body.appendChild(wrapper);

  return wrapper;
};

const ReactPortal = ({ wrapperId, children }) => {
  const [wrapper, setWrapper] = useState(null);

  useLayoutEffect(() => {
    let el = document.getElementById(wrapperId);
    let created = false;

    if (!el) {
      created = true;
      el = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapper(el);

    return () => {
      if (created && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [wrapperId]);

  return wrapper ? createPortal(children, wrapper) : null;
};

export default ReactPortal;

ReactPortal.defaultProps = {
  wrapperId: 'root',
};

ReactPortal.propTypes = {
  wrapperId: PropTypes.string,
  children: PropTypes.node,
};
