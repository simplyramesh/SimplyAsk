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
  SidedrawerModal,
  Switch,
  TextArea,
  TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import { getCategoryById, saveCategory, updateCategory } from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import getSubForm from '../../SubForms/SubFormSelect';
import classes from './CategoryDetails.module.css';

const DEFAULT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  description: '',
  href: '',
  isRoot: false,
  lastUpdate: '',
  lifecycleStatus: '',
  name: '',
  productOffering: [],
  subCategory: [],
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
  version: '',
};

const CategoryDetails = () => {
  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  const [subForm, setSubForm] = useState();
  const [showModal, setShowModal] = useState(false);
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
        const { data } = await getCategoryById(params.CategoryId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {
        toast.error('Something went wrong!');
      }
      setLoading(false);
    };
    getData();
  }, [params.CategoryId]);

  useEffect(() => {
    if (formInput.validFor.startDateTime) setStartDateTime(moment(formInput.validFor.startDateTime).toDate());
    if (formInput.validFor.endDateTime) setEndDateTime(moment(formInput.validFor.endDateTime).toDate());
  }, [formInput]);

  const save = async () => {
    setSaving(true);
    try {
      if (params.CategoryId !== ':CategoryId') await updateCategory(params.CategoryId, formInput);
      else await saveCategory(formInput);
      setInitialFormInput(formInput);
      toast.success('Save successful');
    } catch (ex) {
      toast.error('Something went wrong!');
    }
    setSaving(false);
  };

  const reset = () => {
    setFormInput(initialFormInput);
    if (initialFormInput.validFor.startDateTime) setStartDateTime(moment(initialFormInput.validFor.startDateTime).toDate());
    else setStartDateTime(null);
    if (initialFormInput.validFor.endDateTime) setEndDateTime(moment(initialFormInput.validFor.endDateTime).toDate());
    else setEndDateTime(null);
    toast.success('Form reset');
  };

  if (loading) return <Spinner parent />;
  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_CATEGORY}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>{location.state?.addNew ? <p>Add New Category</p> : <p>Category Details</p>}</span>
        </div>
      </TopMenuBar>
      <Card className={classes.formCard}>
        <div className={classes.form}>
          <div>
            <label>Name</label>
            <Input
              className={classes.input}
              id="name"
              value={formInput.name}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
            />
          </div>
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
          <div className={classes.description}>
            <label>Description</label>
            <TextArea
              className={classes.input}
              id="description"
              value={formInput.description}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))}
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
            <label>HREF</label>
            <Input
              className={classes.input}
              id="href"
              value={formInput.href}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, href: e.target.value }))}
            />
          </div>
          <div>
            <label>Root</label>
            <Switch
              id="isRoot"
              checked={formInput.isRoot}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, isRoot: e.target.checked }))}
            />
          </div>
          <div>
            <label>Life Cycle Status</label>
            <Input
              className={classes.input}
              id="lifecycleStatus"
              value={formInput.lifecycleStatus}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, lifecycleStatus: e.target.value }))}
            />
          </div>

          <div>
            <label>Product Offering</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="productOffering"
              onClick={() => {
                setSubForm('productOffering');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>

          <div>
            <label>Sub Category</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="subCategory"
              onClick={() => {
                setSubForm('subCategory');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>

          <div>
            <label>Valid For</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="validFor"

            >
              + Add
            </button>
          </div>
          <div>
            <label>Version</label>
            <Input
              className={classes.input}
              id="version"
              value={formInput.version}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, version: e.target.value }))}
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
        <SidedrawerModal show={showModal} closeModal={() => setShowModal(false)} width="40vw">
          {getSubForm(formInput, setFormInput, subForm)}
        </SidedrawerModal>
      </Card>
    </>
  );
};

export default CategoryDetails;
