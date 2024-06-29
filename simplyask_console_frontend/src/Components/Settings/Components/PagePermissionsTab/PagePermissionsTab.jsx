import React, { useEffect, useState } from 'react';
// import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { SidedrawerModal } from 'simplexiar_react_components';

import { useUser } from '../../../../contexts/UserContext';
import {
  editPermissionsStatus,
  getPagePermissionByPlatformAndProfile,
} from '../../../../Services/axios/pagePermissionsAxios';
import { getActivePlatformProfileById, getUserPlatformConfigurationById } from '../../../../Services/axios/userAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import PagePermissionsCard from './PagePermissionsCard/PagePermissionsCard';
import PagePermissionsModalView from './PagePermissionsModalView/PagePermissionsModalView';
import classes from './PagePermissionsTab.module.css';

const PagePermissionsTab = () => {
  const { user } = useUser();
  const { data: platformId, isLoading: loadingPlatform } = useQuery({
    queryKey: ['getUserPlatformConfigurationById', user.id],
    queryFn: () => getUserPlatformConfigurationById(user.id),
  });
  const { data: profileId, isLoading: loadingProfile } = useQuery({
    queryKey: ['getActivePlatformProfileById', user.id],
    queryFn: () => getActivePlatformProfileById(user.id),
  });

  const [editingPage, setEditingPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState();
  const [roles, setRoles] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [allFilterActive, setAllFilterActive] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const pages = (await getPagePermissionByPlatformAndProfile(platformId, profileId)).data;
        setRoles(pages.roleIndexes);
        setPairs(Object.entries(pages.pagePermissionPairsList));
      } catch {}
      setLoading(false);
    };
    if (platformId && profileId && !loadingAPI) getPermissions();
  }, [platformId, profileId, loadingAPI]);

  const onManagePagesClick = (role) => {
    setSelectedRole(role);
    const ind = roles.indexOf(role);
    setSelectedRoleIndex(ind);
    setEditingPage(true);
    setShowModal(true);
  };

  const editPage = async (updatedData, roleIndex) => {
    setLoading(true);
    setLoadingAPI(true);
    const res = await editPermissionsStatus(platformId, roleIndex, updatedData);
    if (res) {
      toast.success('Page permissions have been updated successfully!');
      if (selectedRole === user.role.toUpperCase()) {
        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      }
    } else {
      toast.error('Something went wrong while updating permissions');
    }
    setLoading(false);
    setLoadingAPI(false);
    setShowModal(false);
  };

  const closeModal = () => setShowModal(false);

  // const renderThumb = ({ style, ...props }) => {
  //   const thumbStyle = {
  //     borderRadius: 6,
  //     backgroundColor: 'rgba(0, 0, 0, 0.2)',
  //   };
  //   return <div style={{ ...style, ...thumbStyle }} {...props} />;
  // };

  // const CustomScrollbars = (props) => (
  //   <Scrollbars renderThumbHorizontal={renderThumb} renderThumbVertical={renderThumb} {...props} />
  // );

  if (loading || loadingPlatform || loadingProfile || !pairs || !roles) {
    return <Spinner inline />;
  }
  return (
    <div className={classes.root}>
      <div className={classes.contentHeight}>
        <div className={classes.pages}>
          {pairs?.map((pair, i) => (
            <PagePermissionsCard
              key={i}
              index={i}
              role={roles[i]}
              pages={pair[1]}
              showModal={showModal}
              onClick={onManagePagesClick}
              allFilterActive={allFilterActive}
            />
          ))}
        </div>
      </div>

      <SidedrawerModal show={showModal} closeModal={closeModal} width="40vw">
        {editingPage && showModal && (
          <PagePermissionsModalView
            index={selectedRoleIndex}
            show={showModal}
            role={selectedRole}
            roleIndex={selectedRoleIndex}
            pages={pairs[selectedRoleIndex][1]}
            setAllFilterActive={setAllFilterActive}
            onEditPage={editPage}
          />
        )}
      </SidedrawerModal>
    </div>
  );
};

export default PagePermissionsTab;
