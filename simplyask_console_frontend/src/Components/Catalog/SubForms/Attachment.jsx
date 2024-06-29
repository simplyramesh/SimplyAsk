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
import { saveAttachmentRefOrValue } from '../../../Services/axios/catalogAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './SubForm.module.css';

const TABS = { SELECT: 0, CREATE: 1 };

const DEFAULT_ATTACHMENT_FORM = {
  baseType: '',
  referredType: '',
  schemaLocation: '',
  type: '',
  attachmentType: '',
  content: '',
  description: '',
  href: '',
  mimeType: '',
  name: '',
  size: {
    amount: null,
    units: '',
  },
  url: '',
  validFor: {
    endDateTime: '',
    startDateTime: '',
  },
};

const Attachment = ({ formInput, setFormInput }) => {
  const [tab, setTab] = useState(TABS.SELECT);

  const {
    response: attachmentRefOrValues,
    isLoading,
    fetchData,
  } = useAxiosGet('/CTLG_AttachmentRefOrValue', true, CATALOG_API);

  const [attachmentFormInput, setAttachmentFormInput] = useState(DEFAULT_ATTACHMENT_FORM);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [savingCreate, setSavingCreate] = useState(false);

  const onTabButtonClick = (newTab) => {
    if (tab === newTab) return;
    setTab(newTab);
  };

  const addOnClick = () => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.attachment.push(DEFAULT_ATTACHMENT_FORM);
    setFormInput(newFormInput);
  };

  const deleteOnClick = (index) => {
    const newFormInput = JSON.parse(JSON.stringify(formInput));
    newFormInput.attachment.splice(index, 1);
    setFormInput(newFormInput);
  };

  const saveCreate = async () => {
    setSavingCreate(true);
    try {
      await saveAttachmentRefOrValue(attachmentFormInput);
      await fetchData();
      setAttachmentFormInput(DEFAULT_ATTACHMENT_FORM);
      toast.success('Attachment created!');
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
        <p>Attachment</p>
      </div>
      {(() => {
        if (tab === TABS.SELECT) {
          return (
            <Scrollbars className={classes.scrollbars}>
              {formInput.attachment.map((attachment, index) => (
                <section className={classes.selectContainer}>
                  <Autocomplete
                    className={classes.autoComplete}
                    options={attachmentRefOrValues}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
                    value={formInput.attachment[index]}
                    size="small"
                    onChange={(event, newValue) => {
                      const newFormInput = JSON.parse(JSON.stringify(formInput));
                      newFormInput.attachment[index] = newValue;
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
                  value={attachmentFormInput.name}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
                />
              </section>
              <section className={classes.description}>
                <label>Description</label>
                <TextArea
                  id="description"
                  value={attachmentFormInput.description}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>Content</label>
                <Input
                  className={classes.input}
                  id="content"
                  value={attachmentFormInput.content}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, content: e.target.value }))}
                />
              </section>
              <section>
                <label>Attachment Type</label>
                <Input
                  className={classes.input}
                  id="attachmentType"
                  value={attachmentFormInput.attachmentType}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({ ...prevValue, attachmentType: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>Base Type</label>
                <Input
                  className={classes.input}
                  id="baseType"
                  value={attachmentFormInput.baseType}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
                />
              </section>
              <section>
                <label>Type</label>
                <Input
                  className={classes.input}
                  id="type"
                  value={attachmentFormInput.type}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
                />
              </section>
              <section>
                <label>Referred Type</label>
                <Input
                  className={classes.input}
                  id="referredType"
                  value={attachmentFormInput.referredType}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({ ...prevValue, referredType: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>Mime Type</label>
                <Input
                  className={classes.input}
                  id="mimeType"
                  value={attachmentFormInput.mimeType}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, mimeType: e.target.value }))}
                />
              </section>
              <section>
                <label>HREF</label>
                <Input
                  className={classes.input}
                  id="href"
                  value={attachmentFormInput.href}
                  onChange={(e) => setAttachmentFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
                />
              </section>
              <section>
                <label>Schema Location</label>
                <Input
                  className={classes.input}
                  id="schemaLocation"
                  value={attachmentFormInput.schemaLocation}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))
                  }
                />
              </section>
              <section>
                <label>Amount</label>
                <Input
                  className={classes.input}
                  id="amount"
                  value={attachmentFormInput.size.amount}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({
                      ...prevValue,
                      size: { ...prevValue.size, amount: e.target.value },
                    }))
                  }
                />
              </section>
              <section>
                <label>Units</label>
                <Input
                  className={classes.input}
                  id="units"
                  value={attachmentFormInput.size.units}
                  onChange={(e) =>
                    setAttachmentFormInput((prevValue) => ({
                      ...prevValue,
                      size: { ...prevValue.size, units: e.target.value },
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
                    setAttachmentFormInput((prevValue) => ({
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
                    setAttachmentFormInput((prevValue) => ({
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

export default Attachment;

Attachment.propTypes = {
  formInput: PropTypes.shape({
    attachment: PropTypes.arrayOf(
      PropTypes.shape({
        baseType: PropTypes.string,
        referredType: PropTypes.string,
        schemaLocation: PropTypes.string,
        type: PropTypes.string,
        attachmentType: PropTypes.string,
        content: PropTypes.string,
        description: PropTypes.string,
        href: PropTypes.string,
        mimeType: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.shape({
          amount: PropTypes.string,
          units: PropTypes.string,
        }),
        validFor: PropTypes.shape({
          startDateTime: PropTypes.string,
          endDateTime: PropTypes.string,
        }),
      })
    ),
  }),
  setFormInput: PropTypes.func,
};
