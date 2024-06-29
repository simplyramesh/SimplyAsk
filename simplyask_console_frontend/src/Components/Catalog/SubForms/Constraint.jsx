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
import { saveConstraint } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_CONSTRAINT_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
  version: '',
};

const Constraint = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const { response: constraintRefs, isLoading, fetchData } = useAxiosGet('/CTLG_ConstraintRef', true, CATALOG_API);

  const [constraintFormInput, setConstraintFormInput] = useState(DEFAULT_CONSTRAINT_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.constraint.push(DEFAULT_CONSTRAINT_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.constraint.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveConstraint(constraintFormInput);
      await fetchData();
      setConstraintFormInput(DEFAULT_CONSTRAINT_FORM);
      toast.success('Constraint created!');
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
        <p>Constraint</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.constraint.map((constraint, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={constraintRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.constraint[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.constraint[index] = newValue;
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
                  value={constraintFormInput.baseType}
                  onChange={(e) => setConstraintFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>ReferredType</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={constraintFormInput.referredType}
                  onChange={(e) =>
                    setConstraintFormInput((prevValue) => ({
                      ...prevValue,
                      referredType: e.target.value,
                    }))
                  }
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={constraintFormInput.schemaLocation}
                  onChange={(e) =>
                    setConstraintFormInput((prevValue) => ({
                      ...prevValue,
                      schemaLocation: e.target.value,
                    }))
                  }
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={constraintFormInput.type}
                  onChange={(e) => setConstraintFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={constraintFormInput.href}
                  onChange={(e) => setConstraintFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Name</label>
                <Input
                  className={classes.input}
                  id="id"
                  value={constraintFormInput.name}
                  onChange={(e) => setConstraintFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Version</label>
                <Input
                  className={classes.input}
                  id="id"
                  value={constraintFormInput.version}
                  onChange={(e) => setConstraintFormInput((prevValue) => ({ ...prevValue, version: e.target.value }))}
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

export default Constraint;

Constraint.propTypes = {
  formInput: PropTypes.shape({
    constraint: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        referredType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        href: PropTypes.string,
        name: PropTypes.string,
        version: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
