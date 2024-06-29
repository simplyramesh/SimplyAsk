import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, TextArea } from 'simplexiar_react_components';

import { saveAgentGroup, updateAgentGroup } from '../../../../../Services/axios/agentGroupAxios';
import { accessObjectProperty } from '../../../../../utils/helperFunctions';
import Spinner from '../../../../shared/Spinner/Spinner';
import classes from './AgentGroupsTabModalView.module.css';
import CustomDropdownIndicator from '../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const AgentGroupsTabModalView = ({ group, skills, readOnly, refetchTableData, closeModal }) => {
  const [formInput, setFormInput] = useState({ group: null, name: '', description: '' });
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [selectSkills, setSelectSkills] = useState([]);

  const [invalidName, setInvalidName] = useState(false);
  const [invalidDescription, setInvalidDescription] = useState(false);
  const [, setInvalidSkillType] = useState(false);

  useEffect(() => {
    if (closeModal && !group) {
      setFormInput({ group: null, name: '', description: '' });
      setLoadingAPI(false);
      setSelectSkills([]);
    }
  }, [closeModal, group]);

  useEffect(() => {
    if (closeModal) {
      setInvalidName(false);
      setInvalidDescription(false);
      setInvalidSkillType(false);
    }
  }, [closeModal]);

  useEffect(() => {
    if (group) {
      const name = accessObjectProperty(group, 'name');
      const description = accessObjectProperty(group, 'description');

      if (group?.skills) mapUniqueSkillTypesToSelectedSkills(group?.skills, skills);

      setFormInput({ group, name, description });
    }
  }, [group, closeModal]);

  const mapUniqueSkillTypesToSelectedSkills = (currentSkills, skills) => {
    const getSkillIds = [];

    const getObjectValues = Object.values(currentSkills);
    getObjectValues?.map((item) => {
      const arrayToString = item.toString();
      arrayToString?.split(',')?.map((id) => getSkillIds.push(id));
    });

    if (getSkillIds?.length > 0) {
      const filterCurrentSkills = getSkillIds?.map((skillId) => {
        const filteredSkills = skills?.find((skill) => skill.id === skillId);
        return filteredSkills;
      });

      setSelectSkills(
        filterCurrentSkills.map((item) => ({
          value: item.id,
          label: item.name,
          skillTypeName: item.skillTypeName,
        }))
      );
    }
  };

  const mapSelectedSkillsToUniqueSkillTypes = (appendSkillIdsToTypes) => {
    const getAllSkillTypes = selectSkills.map((item) => item.skillTypeName);
    const uniqueSkillTypes = getAllSkillTypes.filter((item, pos) => {
      return getAllSkillTypes.indexOf(item) === pos;
    });

    selectSkills.map((skill) => {
      uniqueSkillTypes.map((skillType) => {
        if (skill.skillTypeName === skillType) {
          if (skillType in appendSkillIdsToTypes) {
            const getKeyValue = appendSkillIdsToTypes[skillType];
            getKeyValue.push(skill.value);
            appendSkillIdsToTypes[skillType] = getKeyValue;
          } else Object.assign(appendSkillIdsToTypes, { [skillType]: [skill.value] });
        }
      });
    });
  };

  const createGroup = async () => {
    if (readOnly) return toast.error('Editing in read only mode is not permitted!');

    let errorsCounter = 0;

    if (!formInput.name) {
      setInvalidName(true);
      errorsCounter++;
    }

    if (!formInput.description) {
      setInvalidDescription(true);
      errorsCounter++;
    }

    if (selectSkills.length === 0) {
      setInvalidSkillType(true);
      errorsCounter++;
    }

    if (errorsCounter > 0) return toast.error('Please fill the required fields');

    const appendSkillIdsToTypes = {};

    mapSelectedSkillsToUniqueSkillTypes(appendSkillIdsToTypes);

    const agentGroup = {
      name: formInput.name,
      description: formInput.description,
      skills: appendSkillIdsToTypes,
    };

    setLoadingAPI(true);

    if (group) agentGroup.id = group.id; // updating a group

    try {
      if (!agentGroup.id) {
        await saveAgentGroup(agentGroup);
      } else {
        await updateAgentGroup(agentGroup);
      }
      refetchTableData(false);
      toast.success(`${agentGroup.name} group has been successfully ${agentGroup.id ? 'updated' : 'added'}.`);
      setLoadingAPI(false);
      closeModal();
    } catch (error) {
      toast.error('something went wrong');
      setLoadingAPI(false);
    }
  };

  const onSkillTypeChange = (event) => {
    if (!event) return;

    setSelectSkills([...event]);
  };

  const getSkillsOptions = () => {
    return skills?.map((item) => ({
      value: item.id,
      label: item.name,
      skillTypeName: item.skillTypeName,
    }));
  };

  if (loadingAPI) return <Spinner parent />;
  return (
    <div className={classes.root}>
      <div>
        <Button
          color="primary"
          className={classes.saveButton}
          disabled={loadingAPI}
          isVisible={!readOnly}
          onClick={createGroup}
        >
          Save
        </Button>
      </div>
      <p className={classes.title}>{group ? 'Edit Group' : 'Add New Group'}</p>
      <div>
        <section onFocus={() => setInvalidName(false)}>
          <label>Group Name</label>
          <Input
            className={`${classes.groupNameInput} ${invalidName && classes.fieldInvalid}`}
            placeholder="Enter a group name ..."
            value={formInput.name}
            onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, name: e.target.value }))}
          />
        </section>
        <section className={classes.description} onFocus={() => setInvalidDescription(false)}>
          <label>Description</label>
          <TextArea
            placeholder="Enter a description ..."
            value={formInput.description}
            onChange={(e) => setFormInput((prevValue) => ({ ...prevValue, description: e.target.value }))}
            className={`${classes.groupNameInput} ${invalidDescription && classes.fieldInvalid}`}
          />
        </section>
        <section onFocus={() => setInvalidSkillType(false)}>
          <label>Skills</label>
          <CustomSelect
            options={getSkillsOptions()}
            onChange={onSkillTypeChange}
            value={[...selectSkills]}
            placeholder="Add Skills ..."
            isMulti
            components={{
              DropdownIndicator: CustomDropdownIndicator,
            }}
            withSeparator
            mb={0}
          />
        </section>
      </div>
    </div>
  );
};

export default AgentGroupsTabModalView;

AgentGroupsTabModalView.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    skills: PropTypes.shape({
      SERVICE_TICKET_ASSIGNMENT: PropTypes.arrayOf(PropTypes.string),
      WORKFLOW_EXECUTION_VISIBILITY: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      groupIds: PropTypes.arrayOf(PropTypes.string),
      id: PropTypes.string,
      name: PropTypes.string,
      organizationId: PropTypes.string,
      serviceTypeIds: PropTypes.arrayOf(PropTypes.string),
      skillTypeName: PropTypes.string,
      workflowProcessIds: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  readOnly: PropTypes.bool,
  closeModal: PropTypes.func,
  refetchTableData: PropTypes.func,
};
