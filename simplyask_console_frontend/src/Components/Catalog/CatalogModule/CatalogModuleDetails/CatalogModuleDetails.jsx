import 'react-datepicker/dist/react-datepicker.css';

import { KeyboardBackspace } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  Input,
  TextArea,
  TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import {
  getCatalogById,
  saveCatalog,
  updateCatalog,
} from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import classes from './CatalogModuleDetails.module.css';

const DEFAULT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  catalogType: '',
  category: [],
  id: '',
  name: '',
  description: '',
  lastUpdate: '',
  lifecycleStatus: '',
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
  relatedParty: [],
  version: '',
};

const CatalogModuleDetails = () => {
  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getCatalogById(params.catalogId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {
        toast.error('Something went wrong!');
      }
      setLoading(false);
    };
    getData();
  }, [params.catalogId]);

  const save = async () => {
    setSaving(true);
    try {
      const timedForm = { ...formInput, lastUpdate: moment().toISOString() };
      if (params.catalogId !== ':catalogId') await updateCatalog(params.catalogId, timedForm);
      else await saveCatalog(timedForm);
      toast.success('Save successful');
    } catch (ex) {
      toast.error('Something went wrong!');
    }
    setSaving(false);
  };

  const reset = () => {
    setFormInput(initialFormInput);
    toast.success('Form reset');
  };

  if (loading) return <Spinner parent />;

  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_MODULE}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {location.state?.addNew ? (
              <p>Add New Catalog Module</p>
            ) : (
              <p>Catalog Module Details</p>
            )}
          </span>
        </div>
      </TopMenuBar>

      <div className={classes.center}>
        <Card className={classes.formCard}>
          <div className={classes.form}>
            <div>
              <label> Base Type </label>
              <Input
                className={classes.input}
                id="baseType"
                value={formInput.baseType}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  baseType: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Type</label>
              <Input
                className={classes.input}
                id="type"
                value={formInput.type}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  type: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Schema Location</label>
              <Input
                className={classes.input}
                id="schemaLocation"
                value={formInput.schemaLocation}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  schemaLocation: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Catalog Type</label>
              <Input
                className={classes.input}
                id="catalogType"
                value={formInput.catalogType}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  catalogType: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Name</label>
              <Input
                className={classes.input}
                id="name"
                value={formInput.name}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  name: e.target.value,
                }))}
              />
            </div>

            <div className={classes.description}>
              <label>Description</label>
              <TextArea
                className={classes.input}
                id="description"
                value={formInput.description}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  description: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Life Cycle Status</label>
              <Input
                className={classes.input}
                id="lifecycleStatus"
                value={formInput.lifecycleStatus}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  lifecycleStatus: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Version</label>
              <Input
                className={classes.input}
                id="version"
                value={formInput.version}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  version: e.target.value,
                }))}
              />
            </div>

            <div>
              <label>Start Date Time</label>
              <DatePicker
                className={classes.datePicker}
                selected={startDateTime}
                onChange={(date) => {
                  setStartDateTime(date);
                  setFormInput((prevValue) => ({
                    ...prevValue,
                    validFor: { ...prevValue.validFor, startDateTime: date },
                  }));
                }}
              />
            </div>

            <div>
              <label>End Date Time</label>
              <DatePicker
                className={classes.datePicker}
                selected={endDateTime}
                onChange={(date) => {
                  setEndDateTime(date);
                  setFormInput((prevValue) => ({
                    ...prevValue,
                    validFor: { ...prevValue.validFor, endDateTime: date },
                  }));
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
      </div>
    </>
  );
};

export default CatalogModuleDetails;
