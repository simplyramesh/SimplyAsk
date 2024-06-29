import 'react-datepicker/dist/react-datepicker.css';

import { KeyboardBackspace } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button, Card, Input, Switch, TextArea,
  TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import {
  getProductSpecificationById,
  saveProductSpecification,
  updateProductSpecification,
} from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import classes from './ProductSpecificationDetails.module.css';

const DEFAULT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  brand: '',
  attachment: [],
  description: '',
  name: '',
  productNumber: '',
  bundledProductSpecification: [],
  lifecycleStatus: '',
  isBundle: '',
  lastUpdate: '',
  productSpecCharacteristic: [],
  productSpecificationRelationship: [],
  relatedParty: [],
  resourceSpecification: [],
  serviceSpecification: [],
  version: '',
  targetProductSchema: '',
  validFor: {
    startDateTime: null,
    endDateTime: null,
  },
};

const ProductSpecificationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  // const [subForm, setSubForm] = useState();
  // const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getProductSpecificationById(params.productSpecificationId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {}
      setLoading(false);
    };
    getData();
  }, [params.productSpecificationId]);

  const save = async () => {
    setSaving(true);
    try {
      const timedForm = { ...formInput, lastUpdate: moment().toISOString() };
      if (params.productSpecificationId !== ':productSpecificationId') await updateProductSpecification(params.productSpecificationId, formInput);
      else await saveProductSpecification(timedForm);
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
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_SPECIFICATION}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {location.state?.addNew ? (
              <p>Add New Product Specification</p>
            ) : (
              <p>Product Specification Details</p>
            )}
          </span>
        </div>
      </TopMenuBar>
      <div className={classes.center}>
        <Card className={classes.formCard}>
          <div className={classes.form}>
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
            <div>
              <label>Base Type</label>
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
              <label>Attachment</label>
              <button
                className={`${classes.input} ${classes.button}`}
                id="attachment"
                onClick={() => {
                  // setSubForm("attachment");
                  // setShowModal(true);
                }}
              >
                + Add
              </button>
            </div>
            <div className={classes.pairedSwitches}>
              <div>
                <label>Bundle</label>
                <Switch
                  id="isBundle"
                  checked={formInput.isBundle}
                  onChange={(e) => setFormInput((prevValue) => ({
                    ...prevValue,
                    isBundle: e.target.checked,
                  }))}
                />
              </div>
              <div>
                <label>Default</label>
                <Switch
                  id="isDefault"
                  checked={formInput.isDefault}
                  onChange={(e) => setFormInput((prevValue) => ({
                    ...prevValue,
                    isDefault: e.target.checked,
                  }))}
                />
              </div>
            </div>
            <div>
              <label>Product Number</label>
              <Input
                className={classes.input}
                id="productNumber"
                value={formInput.productNumber}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  productNumber: e.target.value,
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
              <label>Brand</label>
              <Input
                className={classes.input}
                id="brand"
                value={formInput.brand}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  brand: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Attachment</label>
              <Input
                className={classes.input}
                id="attachment"
                value={formInput.attachment}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  attachment: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Bundled Product Specification</label>
              <Input
                className={classes.input}
                id="bundledProductSpecification"
                value={formInput.bundledProductSpecification}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  bundledProductSpecification: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Product Specification Characteristic</label>
              <Input
                className={classes.input}
                id="productSpecCharacteristic"
                value={formInput.productSpecCharacteristic}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  productSpecCharacteristic: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Produt Specification Relationship</label>
              <Input
                className={classes.input}
                id="productSpecificationRelationship"
                value={formInput.productSpecificationRelationship}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  productSpecificationRelationship: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Related Party</label>
              <Input
                className={classes.input}
                id="relatedParty"
                value={formInput.relatedParty}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  relatedParty: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Resource Specification</label>
              <Input
                className={classes.input}
                id="resourceSpecification"
                value={formInput.resourceSpecification}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  resourceSpecification: e.target.value,
                }))}
              />
            </div>
            <div>
              <label>Service Specification</label>
              <Input
                className={classes.input}
                id="serviceSpecification"
                value={formInput.serviceSpecification}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  serviceSpecification: e.target.value,
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
              <label>Target Product Schema</label>
              <Input
                className={classes.input}
                id="targetProductSchema"
                value={formInput.targetProductSchema}
                onChange={(e) => setFormInput((prevValue) => ({
                  ...prevValue,
                  targetProductSchema: e.target.value,
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

export default ProductSpecificationDetails;
