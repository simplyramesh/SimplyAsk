import 'react-datepicker/dist/react-datepicker.css';

import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Input } from 'simplexiar_react_components';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { savePricingLogicAlgorithm } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_PLA_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  description: '',
  href: '',
  name: '',
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
};

const PricingLogicAlgorithm = ({ formInput, setFormInput }) => {
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: pricingLogicAlgorithms,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_PricingLogicAlgorithm', true, CATALOG_API);

  const [plaFormInput, setPLAFormInput] = useState(DEFAULT_PLA_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.pricingLogicAlgorithm.push(DEFAULT_PLA_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.pricingLogicAlgorithm.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await savePricingLogicAlgorithm(plaFormInput);
      await fetchData();
      setPLAFormInput(DEFAULT_PLA_FORM);
      toast.success('Pricing Logic Algorithm created!');
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
        <p>Pricing Logic Algorithm</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.pricingLogicAlgorithm.map((pr, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={pricingLogicAlgorithms}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.pricingLogicAlgorithm[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.pricingLogicAlgorithm[index] = newValue;
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
                  value={plaFormInput.name}
                  onChange={(e) => setPLAFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={plaFormInput.baseType}
                  onChange={(e) => setPLAFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={plaFormInput.type}
                  onChange={(e) => setPLAFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>

              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={plaFormInput.schemaLocation}
                  onChange={(e) => setPLAFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
                />
              </section>
              <section>
                <label>Start Date Time</label>
                <DatePicker
                  className={classes.datePicker}
                  selected={startDateTime}
                  onChange={(date) => {
                    setStartDateTime(date);
                    setFormInput((prevValue) => ({
                      ...prevValue,
                      validFor: { ...prevValue.validFor, startDateTime: date },
                    }));
                  }}
                />
              </section>
              <section>
                <label>End Date Time</label>
                <DatePicker
                  className={classes.datePicker}
                  selected={endDateTime}
                  onChange={(date) => {
                    setEndDateTime(date);
                    setFormInput((prevValue) => ({
                      ...prevValue,
                      validFor: { ...prevValue.validFor, endDateTime: date },
                    }));
                  }}
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

export default PricingLogicAlgorithm;

PricingLogicAlgorithm.propTypes = {
  formInput: PropTypes.shape({
    pricingLogicAlgorithm: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        baseType: PropTypes.string,
        type: PropTypes.string,
        schemaLocation: PropTypes.string,
        validFor: PropTypes.shape({
          startDateTime: PropTypes.string,
          endDateTime: PropTypes.string,
        }),
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
