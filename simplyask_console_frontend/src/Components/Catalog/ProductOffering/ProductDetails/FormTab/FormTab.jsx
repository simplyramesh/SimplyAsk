import 'react-datepicker/dist/react-datepicker.css';

import { TextField as TField, Autocomplete } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Input, SidedrawerModal, Switch, TextArea } from 'simplexiar_react_components';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import { CATALOG_API } from '../../../../../Services/axios/AxiosInstance';
import {
  getProductOffering,
  saveProductOffering,
  updateProductOffering,
} from '../../../../../Services/axios/catalogAxios';
import Spinner from '../../../../shared/Spinner/Spinner';
import getSubForm from '../../../SubForms/SubFormSelect';
import classes from './FormTab.module.css';

const DEFAULT_FORM = {
  baseType: '',
  schemaLocation: '',
  type: '',
  agreement: [],
  attachment: [],
  bundledProductOffering: [],
  category: [],
  channel: [],
  description: '',
  href: '',
  isBundle: false,
  isSellable: false,
  lastUpdate: '',
  lifecycleStatus: '',
  marketSegment: [],
  name: '',
  place: [],
  prodSpecCharValueUse: [],
  productOfferingPrice: [],
  productOfferingTerm: [],
  productSpecification: null,
  resourceCandidate: null,
  serviceCandidateRef: null,
  serviceLevelAgreement: null,
  statusReason: '',
  validFor: {
    endDateTime: null,
    startDateTime: null,
  },
  version: '',
};

const FormTab = () => {
  const { response: productSpecifications, isLoading: isLoadingProductSpecifications } = useAxiosGet(
    '/CTLG_ProductSpecificationRef',
    true,
    CATALOG_API
  );
  const { response: resourceCandidateRefs, isLoading: isLoadingResourceCandidateRefs } = useAxiosGet(
    '/CTLG_ResourceCandidateRef',
    true,
    CATALOG_API
  );
  const { response: serviceCandidateRefs, isLoading: isLoadingServiceCandidateRefs } = useAxiosGet(
    '/CTLG_ServiceCandidateRef',
    true,
    CATALOG_API
  );
  const { response: slaRefs, isLoading: isLoadingSLARefs } = useAxiosGet('/CTLG_SLARef', true, CATALOG_API);
  const [formInput, setFormInput] = useState(DEFAULT_FORM);
  const [initialFormInput, setInitialFormInput] = useState(DEFAULT_FORM);
  const [subForm, setSubForm] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getProductOffering(params.productId);
        setFormInput(data);
        setInitialFormInput(data);
      } catch {}
      setLoading(false);
    };
    getData();
  }, [params.productId]);

  useEffect(() => {
    if (formInput.validFor.startDateTime) setStartDateTime(moment(formInput.validFor.startDateTime).toDate());
    if (formInput.validFor.endDateTime) setEndDateTime(moment(formInput.validFor.endDateTime).toDate());
  }, [formInput]);

  const save = async () => {
    setSaving(true);
    try {
      const timedForm = { ...formInput, lastUpdate: moment().toISOString() };
      if (params.productId !== ':productId') await updateProductOffering(params.productId, timedForm);
      else await saveProductOffering(timedForm);
      setInitialFormInput(timedForm);
      toast.success('Save successful');
    } catch (ex) {
      toast.error('Something went wrong!');
    }
    setSaving(false);
  };

  const reset = () => {
    setFormInput(initialFormInput);
    if (initialFormInput.validFor.startDateTime)
      setStartDateTime(moment(initialFormInput.validFor.startDateTime).toDate());
    else setStartDateTime(null);
    if (initialFormInput.validFor.endDateTime) setEndDateTime(moment(initialFormInput.validFor.endDateTime).toDate());
    else setEndDateTime(null);
    toast.success('Form reset');
  };

  if (
    loading ||
    isLoadingProductSpecifications ||
    isLoadingResourceCandidateRefs ||
    isLoadingServiceCandidateRefs ||
    isLoadingSLARefs
  )
    return <Spinner parent />;
  return (
    <>
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
          <label>Product Offering Price</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="productOfferingPrice"
            onClick={() => {
              setSubForm('productOfferingPrice');
              setShowModal(true);
            }}
          >
            + Add
          </button>
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
          <label>Agreement</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="agreement"
            onClick={() => {
              setSubForm('agreement');
              setShowModal(true);
            }}
          >
            + Add
          </button>
        </div>
        <div>
          <label>Attachment</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="attachment"
            onClick={() => {
              setSubForm('attachment');
              setShowModal(true);
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
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, isBundle: e.target.checked }))}
            />
          </div>
          <div>
            <label>Sellable</label>
            <Switch
              id="isSellable"
              checked={formInput.isSellable}
              onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, isSellable: e.target.checked }))}
            />
          </div>
        </div>
        <div>
          <label>Bundled Product Offering</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="bundledProductOffering"
            onClick={() => {
              setSubForm('bundledProductOffering');
              setShowModal(true);
            }}
          >
            + Add
          </button>
        </div>
        <div>
          <label>Category</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="category"
            onClick={() => {
              setSubForm('category');
              setShowModal(true);
            }}
          >
            + Add
          </button>
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
          <label>Market Segment</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="marketSegment"
            onClick={() => {
              setSubForm('marketSegment');
              setShowModal(true);
            }}
          >
            + Add
          </button>
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
          <label>Life Cycle Status</label>
          <Input
            className={classes.input}
            id="lifecycleStatus"
            value={formInput.lifecycleStatus}
            onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, lifecycleStatus: e.target.value }))}
          />
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
          <label>Channel</label>
          <button
            className={`${classes.input} ${classes.button}`}
            id="channel"
            onClick={() => {
              setSubForm('channel');
              setShowModal(true);
            }}
          >
            + Add
          </button>
        </div>
        <div>
          <label>Status Reason</label>
          <Input
            className={classes.input}
            id="statusReason"
            value={formInput.statusReason}
            onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, statusReason: e.target.value }))}
          />
        </div>
        <div>
          <label>Resource Candidate</label>
          <Autocomplete
            className={classes.autoComplete}
            options={resourceCandidateRefs}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TField {...params} placeholder="Search..." variant="outlined" />}
            value={formInput.resourceCandidate}
            size="small"
            onChange={(event, newValue) => {
              const newFormInput = JSON.parse(JSON.stringify(formInput));
              newFormInput.resourceCandidate = newValue;
              setFormInput(newFormInput);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
          />
        </div>
        <div>
          <label>Product Specification</label>
          <Autocomplete
            className={classes.autoComplete}
            options={productSpecifications}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TField {...params} placeholder="Search..." variant="outlined" />}
            value={formInput.productSpecification}
            size="small"
            onChange={(event, newValue) => {
              const newFormInput = JSON.parse(JSON.stringify(formInput));
              newFormInput.productSpecification = newValue;
              setFormInput(newFormInput);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
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
          <label>Service Candidate Ref</label>
          <Autocomplete
            className={classes.autoComplete}
            options={serviceCandidateRefs}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TField {...params} placeholder="Search..." variant="outlined" />}
            value={formInput.serviceCandidateRef}
            size="small"
            onChange={(event, newValue) => {
              const newFormInput = JSON.parse(JSON.stringify(formInput));
              newFormInput.serviceCandidateRef = newValue;
              setFormInput(newFormInput);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
          />
        </div>
        <div>
          <label>Service Level Agreement</label>
          <Autocomplete
            className={classes.autoComplete}
            options={slaRefs}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TField {...params} placeholder="Search..." variant="outlined" />}
            value={formInput.serviceLevelAgreement}
            size="small"
            onChange={(event, newValue) => {
              const newFormInput = JSON.parse(JSON.stringify(formInput));
              newFormInput.serviceLevelAgreement = newValue;
              setFormInput(newFormInput);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
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
        <div>
          <label>Start Date Time</label>
          <DatePicker
            className={classes.datePicker}
            selected={startDateTime}
            onChange={(date) => {
              setStartDateTime(date);
              setFormInput((prevValue) => ({ ...prevValue, validFor: { ...prevValue.validFor, startDateTime: date } }));
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
              setFormInput((prevValue) => ({ ...prevValue, validFor: { ...prevValue.validFor, endDateTime: date } }));
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
    </>
  );
};

export default FormTab;
