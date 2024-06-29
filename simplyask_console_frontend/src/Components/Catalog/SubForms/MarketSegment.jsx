import 'react-datepicker/dist/react-datepicker.css';

import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { Input } from 'simplexiar_react_components';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { saveMarketSegment } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_MS_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
};

const MarketSegment = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: marketSegmentRefs,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_MarketSegmentRef', true, CATALOG_API);

  const [msFormInput, setMSFormInput] = useState(DEFAULT_MS_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.marketSegment.push(DEFAULT_MS_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.marketSegment.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveMarketSegment(msFormInput);
      await fetchData();
      setMSFormInput(DEFAULT_MS_FORM);
      toast.success('Market segment created!');
    } catch (ex) {
      toast.error('Something went wrong!');
    }
    setSavingCreate(false);
  };

  if (isLoading) return <Spinner parent />;
  return (
    <>
      <section className={classes.tabContainer}>
        <div
          className={`${classes.tabButton} ${tab === TABS.SELECT && classes.active}`}
          onClick={() => onTabButtonClick(TABS.SELECT)}
        >
          Select
        </div>
        <div
          className={`${classes.tabButton} ${tab === TABS.CREATE && classes.active}`}
          onClick={() => onTabButtonClick(TABS.CREATE)}
        >
          Create
        </div>
      </section>
      <div className={classes.titleContainer}>
        <p>Market Segment</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.marketSegment.map((marketSegment, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={marketSegmentRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.marketSegment[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.marketSegment[index] = newValue;
                      setFormInput(newFormInput);
                    }}
                    getOptionSelected={(option, value) => option.id === value.id}
                  />
                  <HighlightOffIcon className={classes.delete} onClick={() => deleteOnClick(index)} />
                </section>
              ))}
              <div className={classes.addContainer}>
                <span onClick={() => addOnClick()}>
                  <AddIcon /> <b>Add</b>
                </span>
              </div>
            </Scrollbars>
          );
        }
        if (tab === TABS.CREATE) {
          return (
            <Scrollbars className={classes.scrollbars}>
              <section>
                <label>Name</label>
                <Input
                  className={classes.input}
                  id="name"
                  value={msFormInput.name}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={msFormInput.baseType}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={msFormInput.type}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Referred Type</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={msFormInput.referredType}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, referredType: e.target.value }))}
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={msFormInput.href}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={msFormInput.schemaLocation}
                  onChange={(e) => setMSFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
                />
              </section>
              <div className={classes.confirmContainer}>
                {savingCreate ? (
                  <Spinner parent />
                ) : (
                  <button className={classes.saveButton} onClick={() => saveCreate()}>
                    Create
                  </button>
                )}
              </div>
            </Scrollbars>
          );
        }
      })()}
    </>
  );
};

export default MarketSegment;

MarketSegment.propTypes = {
  formInput: PropTypes.shape({
    marketSegment: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        baseType: PropTypes.string,
        type: PropTypes.string,
        referredType: PropTypes.string,
        href: PropTypes.string,
        schemaLocation: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
