import 'react-datepicker/dist/react-datepicker.css';

import { KeyboardBackspace } from '@mui/icons-material';
import { TextField, Autocomplete } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Input, TopMenuBar } from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import { getExportJob, saveExportJob, updateExportJob } from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import classes from './ExportJobDetails.module.css';

const DEFAULT_EJ_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  completionDate: '',
  contentType: '',
  creationDate: '',
  errorLog: '',
  href: '',
  id: '',
  path: '',
  query: '',
  status: '',
  url: '',
};

const ExportJobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [formInput, setFormInput] = useState(DEFAULT_EJ_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_EJ_FORM);
  const [creationDate, setCreationDate] = useState();
  const [completionDate, setCompletionDate] = useState();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getExportJob(params.exportJobId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {}
      setLoading(false);
    };
    getData();
  }, [params.exportJobId]);

  useEffect(() => {
    if (formInput.creationDate) setCreationDate(moment(formInput.creationDate).toDate());
    if (formInput.completionDate) setCompletionDate(moment(formInput.completionDate).toDate());
  }, [formInput]);

  const save = async () => {
    setSaving(true);
    try {
      if (params.exportJobId !== ':exportJobId') await updateExportJob(params.exportJobId, formInput);
      else await saveExportJob(formInput);
      setInitialFormInput(formInput);
      toast.success('Save successful');
    } catch (ex) {
      toast.error('Something went wrong!');
    }
    setSaving(false);
  };

  const reset = () => {
    setFormInput(initialFormInput);
    if (initialFormInput.creationDate) setCreationDate(moment(initialFormInput.creationDate).toDate());
    else setCreationDate(null);
    if (initialFormInput.completionDate) setCompletionDate(moment(initialFormInput.completionDate).toDate());
    else setCompletionDate(null);
    toast.success('Form reset');
  };

  if (loading) return <Spinner parent />;
  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_EXPORT_JOB}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>{location.state?.addNew ? <p>Add New Export Job</p> : <p>Export Job Details</p>}</span>
        </div>
      </TopMenuBar>
      <Card className={classes.formCard}>
        <div className={classes.form}>
          <div>
            <label>Base Type</label>
            <Input
              className={classes.input}
              id="baseType"
              value={formInput.baseType}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, baseType: e.target.value }))}
            />
          </div>
          <div>
            <label>Type</label>
            <Input
              className={classes.input}
              id="type"
              value={formInput.type}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, type: e.target.value }))}
            />
          </div>
          <div>
            <label>Content Type</label>
            <Input
              className={classes.input}
              id="contentType"
              value={formInput.contentType}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, contentType: e.target.value }))}
            />
          </div>
          <div>
            <label>HREF</label>
            <Input
              className={classes.input}
              id="href"
              value={formInput.href}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
            />
          </div>
          <div>
            <label>Path</label>
            <Input
              className={classes.input}
              id="path"
              value={formInput.path}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, path: e.target.value }))}
            />
          </div>
          <div>
            <label>URL</label>
            <Input
              className={classes.input}
              id="url"
              value={formInput.url}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, url: e.target.value }))}
            />
          </div>
          <div>
            <label>Schema Location</label>
            <Input
              className={classes.input}
              id="schemaLocation"
              value={formInput.schemaLocation}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
            />
          </div>
          <div>
            <label>Query</label>
            <Input
              className={classes.input}
              id="query"
              value={formInput.query}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, query: e.target.value }))}
            />
          </div>
          <div>
            <label>Error Log</label>
            <Input
              className={classes.input}
              id="errorLog"
              value={formInput.errorLog}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, errorLog: e.target.value }))}
            />
          </div>
          <div>
            <label>Product Specification</label>
            <Autocomplete
              className={classes.autoComplete}
              options={['Not Started', 'Running', 'Succeeded', 'Failed']}
              renderInput={(params) => <TextField {...params} placeholder="Search..." variant="outlined" />}
              value={formInput.status}
              size="small"
              onChange={(event, newValue) => setFormInput((prevValue) => ({ ...prevValue, status: newValue }))}
            />
          </div>
          <div>
            <label>Creation Date</label>
            <DatePicker
              className={classes.datePicker}
              selected={creationDate}
              onChange={(date) => {
                setCreationDate(date);
                setFormInput((prevValue) => ({ ...prevValue, creationDate: date }));
              }}
            />
          </div>
          <div>
            <label>Completion Date</label>
            <DatePicker
              className={classes.datePicker}
              selected={completionDate}
              onChange={(date) => {
                setCompletionDate(date);
                setFormInput((prevValue) => ({ ...prevValue, completionDate: date }));
              }}
            />
          </div>
        </div>
        <div className={classes.confirmContainer}>
          {saving ? (
            <Spinner parent />
          ) : (
            <>
              <button className={classes.saveButton} onClick={() => save()}>
                Save
              </button>
              <button className={classes.resetButton} onClick={() => reset()}>
                Reset
              </button>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default ExportJobDetails;
