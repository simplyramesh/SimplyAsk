import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'simplexiar_react_components';

import simplyAskLightOrangeIcon from '../../../../../../Assets/icons/simplyAskLightOrangeIcon.svg';
import classes from './UpgradeToEnterpriseModal.module.css';

const UpgradeToEnterpriseModal = () => {
  const enterprisePlanContent = [
    {
      title: 'Products',
      body: 'Converse, Serve, Flow, Resolve, Migrate',
    },
    {
      title: 'Advanced Support',
      body: 'Designated Technical Account Manager',
    },
    {
      title: 'Unlimited Users',
      body: 'No Organization Max User Limit',
    },
    {
      title: 'Enhanced Training',
      body: 'Documents, Videos, Live Sessions',
    },
    {
      title: 'Included Add-Ons',
      body: 'Tailored Views, Features, Integrations',
    },
  ];

  const CheckboxRow = ({ title, body }) => {
    return (
      <div className={classes.enterpriseBodyRoot}>
        <div className="">
          <CheckCircleRoundedIcon className={classes.checkboxIcon} />
        </div>
        <div className={classes.enterpriseBodyCol}>
          <div className={classes.enterpriseContentTitle}>{title}</div>
          <div className={classes.enterpriseContentBody}>{body}</div>
        </div>
      </div>
    );
  };

  CheckboxRow.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string,
  };

  const EnterprisePlan = () => {
    return (
      <div className={classes.enterpriseMiddleRoot}>
        <img src={simplyAskLightOrangeIcon} className={classes.simplyAskIcon1} />
        <img src={simplyAskLightOrangeIcon} className={classes.simplyAskIcon2} />
        <img src={simplyAskLightOrangeIcon} className={classes.simplyAskIcon3} />
        <img src={simplyAskLightOrangeIcon} className={classes.simplyAskIcon4} />
        <img src={simplyAskLightOrangeIcon} className={classes.simplyAskIcon5} />
        <div className={classes.enterpriseCenterDiv}>
          <div className={classes.enterpriseOrangeBox}>
            <div className={classes.enterpriseOrangeBoxBg}>
              <div className={classes.enterpriseOrangeBoxHeader}>Enterprise</div>
            </div>

            <div className={classes.enterprisePlanContent}>
              {enterprisePlanContent?.map((item, index) => (
                <CheckboxRow key={index} title={item.title} body={item.body} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BottomSection = () => {
    return (
      <div className={classes.footerRoot}>
        <Button className={classes.contactUsBtn}>Contact Us</Button>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <EnterprisePlan />
      <BottomSection />
    </div>
  );
};

export default UpgradeToEnterpriseModal;
