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
import { saveProdSpecCharValueUse } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_PSCVU_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  description: '',
  maxCardinality: null,
  minCardinality: null,
  name: '',
  productSpecCharacteristicValue: [],
  productSpecification: {
    baseType: '',
    referredType: '',
    schemaLocation: '',
    type: '',
    href: '',
    name: '',
    targetProductSchema: {
      baseType: '',
      schemaLocation: '',
      type: '',
    },
    version: '',
  },
  validFor: {
    endDateTime: '',
    startDateTime: '',
  },
  valueType: '',
};

const ProdSpecCharValueUse = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: pscvuRefs,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_ProductSpecificationCharacteristicValueUse', true, CATALOG_API);

  const [pscvuFormInput, setPSCVUFormInput] = useState(DEFAULT_PSCVU_FORM);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.prodSpecCharValueUse.push(DEFAULT_PSCVU_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.prodSpecCharValueUse.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveProdSpecCharValueUse(pscvuFormInput);
      await fetchData();
      setPSCVUFormInput(DEFAULT_PSCVU_FORM);
      toast.success('ProdSpecCharValueUse created!');
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
        <p>Prod Spec Char Value Use</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.prodSpecCharValueUse.map((prodSpecCharValueUse, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={pscvuRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.prodSpecCharValueUse[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.prodSpecCharValueUse[index] = newValue;
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
                  value={pscvuFormInput.name}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section className={classes.description}>
                <label>Description</label>
                <TextArea
                  id="description"
                  value={pscvuFormInput.description}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={pscvuFormInput.baseType}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={pscvuFormInput.type}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Value Type</label>
                <Input
                  className={classes.input}
                  id="valueType"
                  value={pscvuFormInput.valueType}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, valueType: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={pscvuFormInput.schemaLocation}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
                />
              </section>
              <section>
                <label>Min Cardinality</label>
                <Input
                  className={classes.input}
                  id="minCardinality"
                  value={pscvuFormInput.minCardinality}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, minCardinality: e.target.value }))}
                />
              </section>
              <section>
                <label>Max Cardinality</label>
                <Input
                  className={classes.input}
                  id="maxCardinality"
                  value={pscvuFormInput.maxCardinality}
                  onChange={(e) => setPSCVUFormInput((prevValue) => ({ ...prevValue, maxCardinality: e.target.value }))}
                />
              </section>
              <section>
                <label>Start Date Time</label>
                <DatePicker
                  className={classes.datePicker}
                  selected={startDateTime}
                  onChange={(date) => {
                    setStartDateTime(date);
                    setPSCVUFormInput((prevValue) => ({
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
                    setPSCVUFormInput((prevValue) => ({
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

export default ProdSpecCharValueUse;

ProdSpecCharValueUse.propTypes = {
  formInput: PropTypes.shape({
    prodSpecCharValueUse: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        description: PropTypes.string,
        maxCardinality: PropTypes.number,
        minCardinality: PropTypes.number,
        name: PropTypes.string,
        productSpecCharacteristicValue: PropTypes.array,
        productSpecification: PropTypes.shape({
          baseType: PropTypes.string,
          referredType: PropTypes.string,
          schemaLocation: PropTypes.string,
          type: PropTypes.string,
          href: PropTypes.string,
          name: PropTypes.string,
          targetProductSchema: PropTypes.shape({
            baseType: PropTypes.string,
            schemaLocation: PropTypes.string,
            type: PropTypes.string,
          }),
          version: PropTypes.string,
        }),
        validFor: PropTypes.shape({
          endDateTime: PropTypes.string,
          startDateTime: PropTypes.string,
        }),
        valueType: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
