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
import { saveCategoryRef } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_CATEGORY_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
  version: '',
};

const Category = ({ formInput, setFormInput, isSubCategory }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const { response: categoryRefs, isLoading, fetchData } = useAxiosGet('/CTLG_CategoryRef', true, CATALOG_API);
  const [categoryFormInput, setCategoryFormInput] = useState(DEFAULT_CATEGORY_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    if (isSubCategory) newFormInput.subCategory.push(DEFAULT_CATEGORY_FORM);
    else newFormInput.category.push(DEFAULT_CATEGORY_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    if (isSubCategory) newFormInput.subCategory.splice(index, 1);
    else newFormInput.category.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveCategoryRef(categoryFormInput);
      await fetchData();
      setCategoryFormInput(DEFAULT_CATEGORY_FORM);
      toast.success('Category created!');
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
        <p>Category</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {isSubCategory
                ? formInput.subCategory.map((category, index) => (
                    <section className={classes.selectContainer}>
                      <Autocomplete
                        className={classes.autoComplete}
                        options={categoryRefs}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                        value={formInput.subCategory[index]}
                        size="small"
                        onChange={(event, newValue) => {
                          const newFormInput = JSON.parse(JSON.stringify(formInput));
                          newFormInput.subCategory[index] = newValue;
                          setFormInput(newFormInput);
                        }}
                        getOptionSelected={(option, value) => option.id === value.id}
                      />
                      <HighlightOffIcon className={classes.delete} onClick={() => deleteOnClick(index)} />
                    </section>
                  ))
                : formInput.category.map((category, index) => (
                    <section className={classes.selectContainer}>
                      <Autocomplete
                        className={classes.autoComplete}
                        options={categoryRefs}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                        value={formInput.category[index]}
                        size="small"
                        onChange={(event, newValue) => {
                          const newFormInput = JSON.parse(JSON.stringify(formInput));
                          newFormInput.category[index] = newValue;
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
                  value={categoryFormInput.name}
                  onChange={(e) => setCategoryFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={categoryFormInput.baseType}
                  onChange={(e) => setCategoryFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={categoryFormInput.type}
                  onChange={(e) => setCategoryFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Referred Type</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={categoryFormInput.referredType}
                  onChange={(e) =>
                    setCategoryFormInput((prevValue) => ({ ...prevValue, referredType: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={categoryFormInput.href}
                  onChange={(e) => setCategoryFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={categoryFormInput.schemaLocation}
                  onChange={(e) =>
                    setCategoryFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>Version</label>
                <Input
                  className={classes.input}
                  id="version"
                  value={categoryFormInput.version}
                  onChange={(e) => setCategoryFormInput((prevValue) => ({ ...prevValue, version: e.target.value }))}
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

export default Category;

Category.propTypes = {
  formInput: PropTypes.shape({
    category: PropTypes.arrayOf(
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
    subCategory: PropTypes.arrayOf(
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
  setFormInput: PropTypes.func.isRequired,
  isSubCategory: PropTypes.bool,
};
