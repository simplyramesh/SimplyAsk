import PropTypes from 'prop-types';

import { SideMenuHeader } from '../../SideMenu';
import { Heading } from '../../sub';
import { Scrollable } from '../../wrappers';
import css from './LogicalOps.module.css';
import RowItem from './RowItem/RowItem';

const LOGIC = [
  { left: '==', right: 'Equal', isHeading: false },
  { left: '!=', right: 'Not Equal', isHeading: false },
  { left: '&&', right: 'And', isHeading: false },
  { left: '||', right: 'Or', isHeading: false },
  { left: '>', right: 'Greater Than', isHeading: false },
  { left: '<', right: 'Less', isHeading: false },
  { left: 'null', right: 'Undefined Value', isHeading: false },
  { left: '( )', right: 'Brackets', isHeading: false },
];

const EXAMPLES = [
  {
    left: (
      <>
        <span>var1 </span>
        <strong>is not equal </strong>
        <span>to var2</span>
      </>
    ),
    right: 'var1 != var2',
    isHeading: false,
  },
  // { left: 'var1 is not equal to var2', right: 'var1 != var2', isHeading: false },
  {
    left: (
      <>
        <span>var1 </span>
        <strong>is not equal </strong>
        <span>to var2 and var3</span>
      </>
    ),
    right: 'var1 != (var2 && var3)',
    isHeading: false,
  },
  // { left: 'var1 is not equal to var2 and var3', right: 'var1 != (var2 && var3)', isHeading: false },
];

const LogicalOps = ({ onClose }) => {
  return (
    <div>
      <SideMenuHeader onClose={onClose} closeIcon />
      <div className={css.container}>
        <Scrollable>
          <section>
            <Heading as="h3" size="large">
              Logical Operators
            </Heading>
            <div className={css.rows}>
              <RowItem left="Operator" right="Meaning" isHeading />
              {LOGIC.map((item, index) => (
                <RowItem
                  key={index}
                  left={item.left}
                  right={item.right}
                  isHeading={item.isHeading}
                  isShaded={!item.isHeading && (index - 1) % 2 === 0}
                  withBorder
                />
              ))}
            </div>
          </section>
          <section>
            <Heading as="h3" size="large">
              Examples
            </Heading>
            <div className={css.rows}>
              <RowItem left="Description" right="Expression" isHeading />
              {EXAMPLES.map((item, index) => (
                <RowItem
                  key={index}
                  left={item.left}
                  right={item.right}
                  isHeading={item.isHeading}
                  isShaded={!item.isHeading && (index - 1) % 2 === 0}
                  withBorder
                  fixedHeight
                />
              ))}
            </div>
          </section>
        </Scrollable>
      </div>
    </div>
  );
};

export default LogicalOps;

LogicalOps.propTypes = {
  onClose: PropTypes.func,
};
