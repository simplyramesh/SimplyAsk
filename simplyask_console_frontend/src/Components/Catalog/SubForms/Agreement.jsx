import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CircularProgress, TextField, Autocomplete } from '@mui/material';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { Input } from 'simplexiar_react_components';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { saveAgreementRef } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_AGREEMENT_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  href: '',
  name: '',
};

const Agreement = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const { response: agreementRefs, isLoading, fetchData } = useAxiosGet('/CTLG_AgreementRef', true, CATALOG_API);

  const [agreementFormInput, setAgreementFormInput] = useState(DEFAULT_AGREEMENT_FORM);
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.agreement.push(DEFAULT_AGREEMENT_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.agreement.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveAgreementRef(agreementFormInput);
      await fetchData();
      setAgreementFormInput(DEFAULT_AGREEMENT_FORM);
      toast.success('Agreement created!');
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
        <p>Agreement</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.agreement.map((agreement, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={agreementRefs}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.agreement[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.agreement[index] = newValue;
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
              {/* <section className={classes.description}>
                  <label>Description</label>
                  <TextArea
                    id="description"
                    value={agreementFormInput.description}
                    onChange={(e) => setAgreementFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))}
                  />
                </section> */}

              <section>
                <label>Name</label>
                <Input
                  className={classes.input}
                  id="id"
                  value={agreementFormInput.name}
                  onChange={(e) => setAgreementFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={agreementFormInput.baseType}
                  onChange={(e) => setAgreementFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={agreementFormInput.type}
                  onChange={(e) => setAgreementFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Referred Type</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={agreementFormInput.referredType}
                  onChange={(e) =>
                    setAgreementFormInput((prevValue) => ({ ...prevValue, referredType: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={agreementFormInput.href}
                  onChange={(e) => setAgreementFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={agreementFormInput.schemaLocation}
                  onChange={(e) =>
                    setAgreementFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))
                  }
                />
              </section>
              <div className={classes.confirmContainer}>
                {savingCreate ? (
                  <CircularProgress className={classes.editSpinner} />
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

export default Agreement;

Agreement.propTypes = {
  formInput: PropTypes.shape({
    agreement: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        baseType: PropTypes.string,
        type: PropTypes.string,
        referredType: PropTypes.string,
        href: PropTypes.string,
        schemaLocation: PropTypes.string,
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
