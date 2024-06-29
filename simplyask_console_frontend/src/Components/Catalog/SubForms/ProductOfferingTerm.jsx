import 'react-datepicker/dist/react-datepicker.css';

import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Input, TextArea } from 'simplexiar_react_components';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { saveProductOfferingTerm } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_POT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  description: '',
  duration: {
    amount: null,
    units: '',
  },
  name: '',
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
};

const ProductOfferingTerm = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: productOfferingTerms,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_ProductOfferingTerm', true, CATALOG_API);

  const [potFormInput, setPOTFormInput] = useState(DEFAULT_POT_FORM);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.productOfferingTerm.push(DEFAULT_POT_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.productOfferingTerm.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveProductOfferingTerm(potFormInput);
      await fetchData();
      setPOTFormInput(DEFAULT_POT_FORM);
      toast.success('Product offering term created!');
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
        <p>Product Offering Term</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.productOfferingTerm.map((productOfferingTerm, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={productOfferingTerms}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.productOfferingTerm[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.productOfferingTerm[index] = newValue;
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
                  value={potFormInput.name}
                  onChange={(e) => setPOTFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section className={classes.description}>
                <label>Description</label>
                <TextArea
                  id="description"
                  value={potFormInput.description}
                  onChange={(e) => setPOTFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={potFormInput.baseType}
                  onChange={(e) => setPOTFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={potFormInput.type}
                  onChange={(e) => setPOTFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={potFormInput.schemaLocation}
                  onChange={(e) => setPOTFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
                />
              </section>
              <section>
                <label>Amount</label>
                <Input
                  className={classes.input}
                  id="amount"
                  value={potFormInput.duration.amount}
                  onChange={(e) =>
                    setPOTFormInput((prevValue) => ({
                      ...prevValue,
                      duration: { ...prevValue.duration, amount: e.target.value },
                    }))
                  }
                />
              </section>
              <section>
                <label>Units</label>
                <Input
                  className={classes.input}
                  id="units"
                  value={potFormInput.duration.units}
                  onChange={(e) =>
                    setPOTFormInput((prevValue) => ({
                      ...prevValue,
                      duration: { ...prevValue.duration, units: e.target.value },
                    }))
                  }
                />
              </section>
              <section>
                <label>Start Date Time</label>
                <DatePicker
                  className={classes.datePicker}
                  selected={startDateTime}
                  onChange={(date) => {
                    setStartDateTime(date);
                    setPOTFormInput((prevValue) => ({
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
                    setPOTFormInput((prevValue) => ({
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

export default ProductOfferingTerm;

ProductOfferingTerm.propTypes = {
  formInput: PropTypes.shape({
    productOfferingTerm: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        description: PropTypes.string,
        duration: PropTypes.shape({
          amount: PropTypes.number,
          units: PropTypes.string,
        }),
        name: PropTypes.string,
        validFor: PropTypes.shape({
          endDateTime: PropTypes.string,
          startDateTime: PropTypes.string,
        }),
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
