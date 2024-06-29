import 'react-slidedown/lib/slidedown.css';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';

import classes from './CurrentInvoiceSection.module.css';

function CurrentInvoiceSection({ data }) {
  const [breakTransactionFees, setBreakTransactionFees] = useState(true);
  const [breakAdditionalFees, setBreakAdditionalFees] = useState(false);

  const openTransactionBreakdown = () => {
    setBreakTransactionFees(!breakTransactionFees);
  };

  const openAdditionalBreakdown = () => {
    setBreakAdditionalFees(!breakAdditionalFees);
  };

  return (
    <div className={classes.root}>
      <div className={classes.firstChild}>

        <div
          className={`${classes.margin_top_20px} ${classes.flex_row} ${classes.openBreakdown}`}
          onClick={openTransactionBreakdown}
        >
          {breakTransactionFees ? (
            <KeyboardArrowUpIcon className={classes.arrowIcon} />
          ) : (
            <KeyboardArrowDownIcon className={classes.arrowIcon} />
          )}

          <div className={classes.flex_row_between}>
            <div className={classes.largeLightText}>Transaction Fees:</div>
            <div className={classes.largeLightText}>
              $
              {data?.transactionCostSum ?? '---'}
            </div>
          </div>
        </div>

        <SlideDown>
          {breakTransactionFees && (
            <div className={classes.breakDownRoot}>
              {data?.transactionCostBreakdown?.map((item, index) => {
                return (
                  <div className={classes.flex_row_between} key={index}>
                    <div className={`${classes.smallLightText} ${classes.dullColor}`}>
                      {`${item.numberOfUnits} ${item.itemName} @ ${item.costPerUnit} per ${item.unitName}`}
                    </div>
                    <div className={`${classes.smallLightText} ${classes.dullColor}`}>
                      $
                      {item.totalCost ?? '---'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SlideDown>

        <div
          className={`${classes.margin_top_20px} ${classes.flex_row} ${classes.openBreakdown}`}
          onClick={openAdditionalBreakdown}
        >
          {breakAdditionalFees ? (
            <KeyboardArrowUpIcon className={classes.arrowIcon} />
          ) : (
            <KeyboardArrowDownIcon className={classes.arrowIcon} />
          )}

          <div className={classes.flex_row_between}>
            <div className={classes.largeLightText}>Add-On Fees:</div>
            <div className={classes.largeLightText}>
              $
              {data?.additionalCostSum ?? '---'}
            </div>
          </div>
        </div>

        <SlideDown>
          {breakAdditionalFees && (
            <div className={classes.breakDownRoot}>
              {data?.additionalCostBreakdown?.map((item, index) => {
                return (
                  <div className={classes.flex_row_between} key={index}>
                    <div className={`${classes.smallLightText} ${classes.dullColor}`}>
                      {`${item.numberOfUnits} ${item.itemName} @ ${item.costPerUnit} per ${item.unitName}`}
                    </div>
                    <div className={`${classes.smallLightText} ${classes.dullColor}`}>
                      $
                      {item.totalCost ?? '---'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SlideDown>
      </div>

      <div className={`${classes.second_child}`}>
        <div className={`${classes.flex_col_less_gap}`}>
          <div className={classes.flex_row_between}>
            <div className={classes.largeBoldText}>
              Estimated Subtotal
              {' '}
              {`(${data?.units ?? '---'})`}
              {' '}
              :
            </div>
            <div className={classes.largeBoldText}>
              $
              {data?.subtotalSum ?? '---'}
            </div>
          </div>

          <div className={classes.flex_row_between}>
            <div className={classes.smallExtraLightText}>
              Additional sales tax may be applied at time of billing
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentInvoiceSection;

CurrentInvoiceSection.propTypes = {
  data: PropTypes.object,
};
