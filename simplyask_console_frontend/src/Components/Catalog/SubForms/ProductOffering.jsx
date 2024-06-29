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
import { saveProductOfferingRef } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_PRODUCT_OFFERING_SUB_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
};

const ProductOffering = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: productOfferingRefs,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_ProductOfferingRef', true, CATALOG_API);

  const [productOfferingFormInput, setProductOfferingFormInput] = useState(DEFAULT_PRODUCT_OFFERING_SUB_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.productOffering.push(DEFAULT_PRODUCT_OFFERING_SUB_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.productOffering.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveProductOfferingRef(productOfferingFormInput);
      await fetchData();
      setProductOfferingFormInput(DEFAULT_PRODUCT_OFFERING_SUB_FORM);
      toast.success('Product Offering created!');
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
        <p>Product Offering</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.productOffering.map((productOffering, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={productOfferingRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.productOffering[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.productOffering[index] = newValue;
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
                  value={productOfferingFormInput.baseType}
                  onChange={(e) =>
                    setProductOfferingFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>ReferredType</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={productOfferingFormInput.referredType}
                  onChange={(e) =>
                    setProductOfferingFormInput((prevValue) => ({
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
                  value={productOfferingFormInput.schemaLocation}
                  onChange={(e) =>
                    setProductOfferingFormInput((prevValue) => ({
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
                  value={productOfferingFormInput.type}
                  onChange={(e) => setProductOfferingFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={productOfferingFormInput.href}
                  onChange={(e) => setProductOfferingFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Name</label>
                <Input
                  className={classes.input}
                  id="id"
                  value={productOfferingFormInput.name}
                  onChange={(e) => setProductOfferingFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
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

export default ProductOffering;

ProductOffering.propTypes = {
  formInput: PropTypes.shape({
    productOffering: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        href: PropTypes.string,
        type: PropTypes.string,
        schemaLocation: PropTypes.string,
        referredType: PropTypes.string,
        baseType: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
