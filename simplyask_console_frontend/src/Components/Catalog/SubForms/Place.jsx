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
import { savePlace } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_PLACE_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
};

const Place = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const { response: placeRefs, isLoading, fetchData } = useAxiosGet('/CTLG_PlaceRef', true, CATALOG_API);

  const [placeFormInput, setPlaceFormInput] = useState(DEFAULT_PLACE_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.place.push(DEFAULT_PLACE_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.place.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await savePlace(placeFormInput);
      await fetchData();
      setPlaceFormInput(DEFAULT_PLACE_FORM);
      toast.success('Place created!');
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
        <p>Place</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.place.map((place, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={placeRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.place[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.place[index] = newValue;
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
                  value={placeFormInput.name}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={placeFormInput.baseType}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={placeFormInput.type}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Referred Type</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={placeFormInput.referredType}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, referredType: e.target.value }))}
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={placeFormInput.href}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={placeFormInput.schemaLocation}
                  onChange={(e) => setPlaceFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
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

export default Place;

Place.propTypes = {
  formInput: PropTypes.shape({
    place: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        baseType: PropTypes.string,
        type: PropTypes.string,
        referredType: PropTypes.string,
        href: PropTypes.string,
        schemaLocation: PropTypes.string,
      })
    ),
  }).isRequired,
  setFormInput: PropTypes.func.isRequired,
};
