import 'react-datepicker/dist/react-datepicker.css';

import { KeyboardBackspace } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button, Card,
  Input, TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import { getImportJobById, saveImportJob, updateImportJob } from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import classes from './ImportJobDetails.module.css';

const DEFAULT_FORM = {
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
  status: '',
  url: '',
};

const ImportJobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [creationDate, setCreationDate] = useState();
  const [completionDate, setCompletionDate] = useState();
  const params = useParams();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getImportJobById(params.importJobId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {
        toast.error('Something went wrong!');
      }

      setLoading(false);
    };
    getData();
  }, [params.importJobId]);

  useEffect(() => {
    if (formInput.creationDate) setCreationDate(moment(formInput.creationDate).toDate());
    if (formInput.completionDate) setCompletionDate(moment(formInput.completionDate).toDate());
  }, [formInput]);

  const save = async () => {
    setSaving(true);
    try {
      if (params.importJobId !== ':importJobId') await updateImportJob(params.importJobId, formInput);
      else await saveImportJob(formInput);
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
            onClick={() => navigate(`${routes.CATALOG_IMPORT_JOB}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {location.state?.addNew ? <p>Add New Import Job</p> : <p>Import Job Details</p>}
          </span>
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
            <label>Schema Location</label>
            <Input
              className={classes.input}
              id="schemaLocation"
              value={formInput.schemaLocation}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, schemaLocation: e.target.value }))}
            />
          </div>
          <div>
            <label>Status</label>
            <Input
              className={classes.input}
              id="status"
              value={formInput.status}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, status: e.target.value }))}
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
            <label>Path</label>
            <Input
              className={classes.input}
              id="path"
              value={formInput.path}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, path: e.target.value }))}
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

export default ImportJobDetails;
