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
import { saveBundledPopRelationship } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_BPR_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
};

const BundledPopRelationship = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: bundledPopRelationships,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_BundledProductOfferingPriceRelationship', true, CATALOG_API);
  const [bprFormInput, setBPRFormInput] = useState(DEFAULT_BPR_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.bundledPopRelationship.push(DEFAULT_BPR_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.bundledPopRelationship.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveBundledPopRelationship(bprFormInput);
      await fetchData();
      setBPRFormInput(DEFAULT_BPR_FORM);
      toast.success('Bundled Pop Relationship created!');
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
        <p>Bundled Pop Relationship</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.bundledPopRelationship.map((bpo, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={bundledPopRelationships}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.bundledPopRelationship[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.bundledPopRelationship[index] = newValue;
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
                  value={bprFormInput.name}
                  onChange={(e) => setBPRFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={bprFormInput.baseType}
                  onChange={(e) => setBPRFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={bprFormInput.type}
                  onChange={(e) => setBPRFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>

              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={bprFormInput.href}
                  onChange={(e) => setBPRFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={bprFormInput.schemaLocation}
                  onChange={(e) => setBPRFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
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

export default BundledPopRelationship;

BundledPopRelationship.propTypes = {
  formInput: PropTypes.shape({
    bundledPopRelationship: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        href: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
