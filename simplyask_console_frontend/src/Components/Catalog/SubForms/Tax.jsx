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
import { saveTax } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_TAX_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  taxAmount: {
    unit: '',
    value: 0,
  },
  taxCategory: '',
  taxRate: 0,
};

const Tax = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const { response: taxRefs, isLoading, fetchData } = useAxiosGet('/CTLG_TaxItem', true, CATALOG_API);

  const [taxFormInput, setTaxFormInput] = useState(DEFAULT_TAX_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.tax.push(DEFAULT_TAX_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.tax.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveTax(taxFormInput);
      await fetchData();
      setTaxFormInput(DEFAULT_TAX_FORM);
      toast.success('Tax created!');
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
        <p>Tax</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.tax.map((tax, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={taxRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.tax[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.tax[index] = newValue;
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
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={taxFormInput.baseType}
                  onChange={(e) => setTaxFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={taxFormInput.type}
                  onChange={(e) => setTaxFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Tax Amount: Unit</label>
                <Input
                  className={classes.input}
                  id="unit"
                  value={taxFormInput.unit}
                  onChange={(e) =>
                    setFormInput((prevValue) => ({
                      ...prevValue,
                      taxAmount: { ...prevValue.taxAmount, unit: e.target.value },
                    }))
                  }
                />
              </section>

              <section>
                <label>Tax Amount: Value</label>
                <Input
                  className={classes.input}
                  id="value"
                  value={taxFormInput.value}
                  onChange={(e) =>
                    setFormInput((prevValue) => ({
                      ...prevValue,
                      taxAmount: { ...prevValue.taxAmount, value: e.target.value },
                    }))
                  }
                />
              </section>
              <section>
                <label>Tax Category</label>
                <Input
                  className={classes.input}
                  id="taxCategory"
                  value={taxFormInput.taxCategory}
                  onChange={(e) => setTaxFormInput((prevValue) => ({ ...prevValue, taxCategory: e.target.value }))}
                />
              </section>
              <section>
                <label>Tax Rate</label>
                <Input
                  className={classes.input}
                  id="taxRate"
                  value={taxFormInput.taxRate}
                  onChange={(e) => setTaxFormInput((prevValue) => ({ ...prevValue, taxRate: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={taxFormInput.schemaLocation}
                  onChange={(e) => setTaxFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
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
        return <></>;
      })()}
    </>
  );
};

export default Tax;

Tax.propTypes = {
  formInput: PropTypes.shape({
    tax: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        taxAmount: PropTypes.shape({
          unit: PropTypes.string,
          value: PropTypes.number,
        }),
        taxCategory: PropTypes.string,
        taxRate: PropTypes.number,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
