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
import { saveBundledProductOffering } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_BPO_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  bundledProductOfferingOption: {
    baseType: '',
    schemaLocation: '',
    type: '',
    numberRelOfferDefault: null,
    numberRelOfferLowerLimit: null,
    numberRelOfferUpperLimit: null,
  },
  href: '',
  lifecycleStatus: '',
  name: '',
};

const BundledProductOffering = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: bundledProductOfferings,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_BundledProductOffering', true, CATALOG_API);
  const [bpoFormInput, setBPOFormInput] = useState(DEFAULT_BPO_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.bundledProductOffering.push(DEFAULT_BPO_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.bundledProductOffering.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveBundledProductOffering(bpoFormInput);
      await fetchData();
      setBPOFormInput(DEFAULT_BPO_FORM);
      toast.success('Bundled product offering created!');
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
        <p>Bundled Product Offering</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.bundledProductOffering.map((bpo, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={bundledProductOfferings}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.bundledProductOffering[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.bundledProductOffering[index] = newValue;
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
                  value={bpoFormInput.name}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={bpoFormInput.baseType}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={bpoFormInput.type}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              {/*
              <section>
                <label>BPO Option</label>
                <Autocomplete />
              </section> */}
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={bpoFormInput.href}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={bpoFormInput.schemaLocation}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
                />
              </section>
              <section>
                <label>Lifecycle Status</label>
                <Input
                  className={classes.input}
                  id="lifecycleStatus"
                  value={bpoFormInput.lifecycleStatus}
                  onChange={(e) => setBPOFormInput((prevValue) => ({ ...prevValue, lifecycleStatus: e.target.value }))}
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

export default BundledProductOffering;

BundledProductOffering.propTypes = {
  formInput: PropTypes.shape({
    bundledProductOffering: PropTypes.arrayOf(
      PropTypes.shape({
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        bundledProductOfferingOption: PropTypes.shape({
          baseType: PropTypes.string,
          schemaLocation: PropTypes.string,
          type: PropTypes.string,
          numberRelOfferDefault: PropTypes.number,
          numberRelOfferLowerLimit: PropTypes.number,
          numberRelOfferUpperLimit: PropTypes.number,
        }),
        href: PropTypes.string,
        lifecycleStatus: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
