import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';

import pdfIcon from '../../../../../../Assets/icons/pdfIcon.svg';
import classes from '../CurrentPlanSection.module.css';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

function InvoicesSection() {
  const invoiceYears = [
    { label: '2020 Invoices', value: 2020 },
    { label: '2021 Invoices', value: 2021 },
    { label: '2022 Invoices', value: 2022 },
  ];

  const invoicesByMonths = [
    { month: 'April 2021', amount: 75.52 },
    { month: 'March 2021', amount: 77.72 },
    { month: 'February 2021', amount: 70.22 },
    { month: 'January 2021', amount: 72.77 },
  ];

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [invoiceYear, setInvoiceYear] = useState();

  const toggleHistorySlider = () => {
    setShowPaymentHistory(!showPaymentHistory);
  };

  const onInvoiceYearChange = (event) => {
    if (!event) return;
    setInvoiceYear(event);
  };

  return (
    <div className={classes.margin_top_15px}>
      <div className={`${classes.flex_row_space_between} ${classes.openHistory}`} onClick={toggleHistorySlider}>
        <div className={classes.largeBoldText}>Payment History</div>
        <div className="">
          {showPaymentHistory ? (
            <KeyboardArrowUpIcon className={classes.arrowIcon} />
          ) : (
            <KeyboardArrowDownIcon className={classes.arrowIcon} />
          )}
        </div>
      </div>

      <SlideDown>
        {showPaymentHistory && (
          <div className={`${classes.margin_top_10px} ${classes.padding_left_1px}`}>
            <div className={classes.largeMidText}>Invoice Period</div>

            <div className={classes.margin_top_10px}>
              <CustomSelect
                options={invoiceYears}
                onChange={onInvoiceYearChange}
                value={[invoiceYear]}
                placeholder="Search Invoice Year ..."
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPortalTarget={document.body}
                closeMenuOnSelect
                withSeparator
                form
              />
            </div>

            <div className={classes.margin_top_15px}>
              <div className={classes.invoiceMonths}>
                {invoicesByMonths?.map((month) => {
                  return (
                    <div className={classes.flex_row_space_between}>
                      <div className={classes.smallLightText}>{month?.month ?? 'Null'}</div>
                      <div className={`${classes.flex_row} ${classes.gap_12px}`}>
                        <div className={classes.smallLightText}>${month?.amount ?? 'Null'}</div>
                        <img src={pdfIcon} alt="" className={classes.pdfIcon} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SlideDown>
    </div>
  );
}

export default InvoicesSection;
