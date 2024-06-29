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
import {
  getProductOfferingPrice,
  saveProductOfferingPrice,
  updateProductOfferingPrice,
} from '../../../../Services/axios/catalogAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import getSubForm from '../../SubForms/SubFormSelect';
import classes from './ProductOfferingPriceDetails.module.css';

const DEFAULT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  bundledPopRelationship: [],
  constraint: [],
  description: '',
  href: '',
  isBundle: false,
  lastUpdate: '',
  lifecycleStatus: '',
  name: '',
  percentage: 0,
  place: [],
  popRelationship: [],
  price: {
    unit: '',
    value: 0,
  },
  priceType: '',
  pricingLogicAlgorithm: [],
  prodSpecCharValueUse: [],
  productOfferingTerm: [],
  recurringChargePeriodLength: 0,
  recurringChargePeriodType: '',
  tax: [],
  unitOfMeasure: {
    amount: 0,
    units: '',
  },
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
  version: '',
};

const ProductOfferingPriceDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  const [subForm, setSubForm] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getProductOfferingPrice(params.productOfferingPriceId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {
        toast.error('Something went wrong!');
      }
      setLoading(false);
    };
    getData();
  }, [params]);

  useEffect(() => {
    if (formInput.validFor.startDateTime) setStartDateTime(moment(formInput.validFor.startDateTime).toDate());
    if (formInput.validFor.endDateTime) setEndDateTime(moment(formInput.validFor.endDateTime).toDate());
  }, [formInput]);

  const save = async () => {
    setSaving(true);
    try {
      const timedForm = { ...formInput, lastUpdate: moment().toISOString() };
      if (params.productOfferingPriceId !== ':productOfferingPriceId') await updateProductOfferingPrice(params.productOfferingPriceId, timedForm);
      else await saveProductOfferingPrice(timedForm);
      setInitialFormInput(timedForm);
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
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_OFFERING_PRICE}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {location.state?.addNew ? (
              <p>Add New Product Offering Price</p>
            ) : (
              <p>Product Offering Price Details</p>
            )}
          </span>
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
            <label>Unit of Measure: Amount</label>
            <Input
              className={classes.input}
              id="amount"
              value={formInput.amount}
              onChange={(e) => setFormInput((prevValue) => ({
                ...prevValue,
                unitOfMeasure: { ...prevValue.unitOfMeasure, amount: e.target.value },
              }))}
            />
          </div>
          <div>
            <label>Unit of Measure: Units</label>
            <Input
              className={classes.input}
              id="units"
              value={formInput.units}
              onChange={(e) => setFormInput((prevValue) => ({
                ...prevValue,
                unitOfMeasure: { ...prevValue.unitOfMeasure, units: e.target.value },
              }))}
            />
          </div>
          <div>
            <label>Bundled Pop Relationship</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="bundledPopRelationship"
              onClick={() => {
                setSubForm('bundledPopRelationship');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Constraint</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="constraint"
              onClick={() => {
                setSubForm('constraint');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Bundle</label>
            <Switch
              id="isBundle"
              checked={formInput.isBundle}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, isBundle: e.target.checked }))}
            />
          </div>
          <div>
            <label>Place</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="place"
              onClick={() => {
                setSubForm('place');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Pop Relationship</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="popRelationship"
              onClick={() => {
                setSubForm('popRelationship');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Unit</label>
            <Input
              className={classes.input}
              id="unit"
              value={formInput.unit}
              onChange={(e) => setFormInput((prevValue) => ({
                ...prevValue,
                price: { ...prevValue.price, unit: e.target.value },
              }))}
            />
          </div>
          <div>
            <label>Pricing Logic Algorithm</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="pricingLogicAlgorithm"
              onClick={() => {
                setSubForm('pricingLogicAlgorithm');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Product Specific Character Value Use</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="prodSpecCharValueUse"
              onClick={() => {
                setSubForm('prodSpecCharValueUse');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Value</label>
            <Input
              className={classes.input}
              id="value"
              value={formInput.value}
              onChange={(e) => setFormInput((prevValue) => ({
                ...prevValue,
                price: { ...prevValue.price, value: e.target.value },
              }))}
            />
          </div>
          <div>
            <label>Product Offering Term</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="productOfferingTerm"
              onClick={() => {
                setSubForm('productOfferingTerm');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Tax</label>
            <button
              className={`${classes.input} ${classes.button}`}
              id="tax"
              onClick={() => {
                setSubForm('tax');
                setShowModal(true);
              }}
            >
              + Add
            </button>
          </div>
          <div>
            <label>Price Type</label>
            <Input
              className={classes.input}
              id="priceType"
              value={formInput.priceType}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, priceType: e.target.value }))}
            />
          </div>
          <div>
            <label>Recurring Charge Period Type</label>
            <Input
              className={classes.input}
              id="recurringChargePeriodType"
              value={formInput.recurringChargePeriodType}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, recurringChargePeriodType: e.target.value }))}
            />
          </div>
          <div>
            <label>Recurring Charge Period Length</label>
            <Input
              className={classes.input}
              id="recurringChargePeriodLength"
              value={formInput.recurringChargePeriodLength}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, recurringChargePeriodLength: e.target.value }))}
            />
          </div>

          <div>
            <label>Percentage</label>
            <Input
              className={classes.input}
              id="percentage"
              value={formInput.percentage}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, percentage: e.target.value }))}
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
            <label>Life Cycle Status</label>
            <Input
              className={classes.input}
              id="lifecycleStatus"
              value={formInput.lifecycleStatus}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, lifecycleStatus: e.target.value }))}
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
          <div>
            <label>Version</label>
            <Input
              className={classes.input}
              id="version"
              value={formInput.version}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, version: e.target.value }))}
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

export default ProductOfferingPriceDetails;
