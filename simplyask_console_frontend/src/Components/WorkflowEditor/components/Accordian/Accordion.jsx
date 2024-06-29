import PropTypes from 'prop-types';
import { isValidElement, useState } from 'react';

import ExpandMoreIcon from '../../Assets/Icons/expandMore.svg?component';
import classes from './Accordion.module.css';

const Accordion = ({ title, subHeading, children, openByDefault = true, isCollapsible = true }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(openByDefault);

  const titleType = isValidElement(title) ? title : <h3>{title}</h3>;

  return (
    <section className={classes.accordion} data-expanded={isAccordionOpen}>
      <div
        aria-label={title?.props?.className?.split('_')[0] || title}
        className={classes.accordion_header}
        onClick={() => {
          if (isCollapsible) setIsAccordionOpen((prev) => !prev);
        }}
      >
        {titleType}
        {isCollapsible ? (
          <ExpandMoreIcon
            className={
              isAccordionOpen ? `${classes.accordion_icon} ${classes.accordion_iconOpen}` : `${classes.accordion_icon}`
            }
          />
        ) : null}
      </div>
      {subHeading && !isAccordionOpen && <div className={classes.accordion_subHeading}>{subHeading}</div>}
      <div aria-hidden={!isAccordionOpen} aria-expanded={isAccordionOpen} className={`${classes.accordion_collapse}`}>
        {children}
      </div>
    </section>
  );
};

export default Accordion;

Accordion.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subHeading: PropTypes.element,
  openByDefault: PropTypes.bool,
  children: PropTypes.node,
};
