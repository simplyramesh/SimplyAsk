import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { saveImgFile } from '../../../../../Services/axios/filesAxios';
import { getUserById } from '../../../../../Services/axios/permissionsUsers';
import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import useUserPfp from '../../../../../hooks/useUserPfp';
import { modifiedCurrentPageDetails } from '../../../../../store';
import { base64ToFile } from '../../../../../utils/functions/fileImageFuncs';
import { getNameInitials } from '../../../../../utils/helperFunctions';
import { useNavigationBlock } from '../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ADD_USER, USER_FIND_BY_ID_RESPONSE } from '../../constants/apiConstants';
import { usePatchEditUser } from '../../hooks/usePatchEditUser';
import { EDIT_USER_VALIDATION_SCHEMA } from '../../utils/validations';
import AvatarCropper from '../Avatar/AvatarCropper/AvatarCropper';
import StyledAvatar, { StyledAvatarMask } from '../Avatar/StyledAvatar';
import FormUserInfo from '../FormUserInfo/FormUserInfo';
const PROFILE_ROUTE = '/Settings/AccessManagement/users';

const EditUser = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { id: userId } = useParams();
  const { currentUser, refetchCurrentUser } = useGetCurrentUser();
  const navigate = useNavigate();

  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [newProfileImg, setNewProfileImg] = useState(null);
  const [croppedProfileImg, setCroppedProfileImg] = useState(null);

  const inputFileRef = useRef(null);

  const getId = userId || currentUser?.id || null;

  const {
    data: userData,
    refetch: refetchUserData,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ['getUserData', getId],
    queryFn: () => getUserById(getId),
    enabled: !!getId,
  });

  useEffect(() => {
    if (userId && userData) {
      setCurrentPageDetailsState({
        disableBreadCrumbLoading: true,
        pageUrlPath: routes.SETTINGS_ACCESS_MANAGER_EDIT_USER,
        clickableIdRoutes: [
          {
            breadCrumbLabel: userData.fullname,
            path: routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS,
            clickablePath: generatePath(routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS, { id: userId }),
          },
        ],
      });
    }
  }, [userId, userData]);

  const initialValues = {
    [ADD_USER.FIRST_NAME]: userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME] || '',
    [ADD_USER.LAST_NAME]: userData?.[USER_FIND_BY_ID_RESPONSE.LAST_NAME] || '',
    [ADD_USER.TIMEZONE]: userData?.[USER_FIND_BY_ID_RESPONSE.TIMEZONE],
    [ADD_USER.EMAIL]: userData?.[USER_FIND_BY_ID_RESPONSE.EMAIL] || '',
    [ADD_USER.PHONE]: userData?.[USER_FIND_BY_ID_RESPONSE.PHONE] || '',
    [ADD_USER.COUNTRY]: userData?.[USER_FIND_BY_ID_RESPONSE.BILLING_COUNTRY] || '',
    [ADD_USER.PROVINCE]: userData?.[USER_FIND_BY_ID_RESPONSE.BILLING_PROVINCE] || '',
    [ADD_USER.CITY]: userData?.[USER_FIND_BY_ID_RESPONSE.CITY] || '',
    [ADD_USER.PFP]: userData?.[USER_FIND_BY_ID_RESPONSE.PFP] || '',
  };

  const { patchEditUserApi, isPatchEditUserApiLoading } = usePatchEditUser({
    onSuccess: ({ variables }) => {
      setCroppedProfileImg(null);

      refetchUserData();
      refetchCurrentUser();
      toast.success(`${variables.userPayload?.[ADD_USER.FIRST_NAME]}'s profile updated successfully`);
    },
  });

  const handleSaveChanges = async (values) => {
    if (isFetching || isRefetching) return;

    const imgFile = croppedProfileImg?.imageFile;

    const country = values[ADD_USER.COUNTRY] === '' ? null : values[ADD_USER.COUNTRY];
    const province = values[ADD_USER.PROVINCE] === '' ? null : values[ADD_USER.PROVINCE];

    const savedImageId = imgFile
      ? await saveImgFile([imgFile], null, userId, true).then((res) => res[0]?.id)
      : values?.pfp;

    const updatedUserData = {
      ...values,
      [ADD_USER.COUNTRY]: country,
      [ADD_USER.PROVINCE]: province,
      pfp: savedImageId,
    };

    patchEditUserApi({ userId: getId, userPayload: updatedUserData });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: EDIT_USER_VALIDATION_SCHEMA,
    validateOnMount: false,
    enableReinitialize: true,
    onSubmit: handleSaveChanges,
  });

  const [profileImg] = useUserPfp(formik.values?.pfp);

  const handleFileChange = (e) => {
    const MAX_FILE_SIZE = 2048; // 2MB
    const file = e.target.files[0];
    const fileSizeKiloBytes = file.size / 1024;
    if (fileSizeKiloBytes <= MAX_FILE_SIZE) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setNewProfileImg({ img: reader.result, name: e.target.files[0].name });
        setIsAvatarCropperOpen(true);

        inputFileRef.current.value = null;
      };
    } else {
      toast.error('Unable to upload the profile image as the file size exceeds 2MB');
    }
  };

  const handleApplyCrop = async (croppedImg) => {
    const imageFile = await base64ToFile(croppedImg, newProfileImg.name);

    setCroppedProfileImg({ img: croppedImg, imageFile });

    setNewProfileImg(null);
  };

  const handleChangePassword = () => {
    navigate(userId ? `${PROFILE_ROUTE}/${userId}/changePassword` : routes.PROFILE_CHANGE_PASSWORD);
  };

  const isNavigationBlocked = !!croppedProfileImg || formik.dirty;

  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const isLoading = isFetching || isPatchEditUserApiLoading;

  return (
    <>
      <AvatarCropper
        image={newProfileImg}
        onClose={() => setIsAvatarCropperOpen(false)}
        open={isAvatarCropperOpen}
        onApply={handleApplyCrop}
      />

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />

      <PageLayout>
        <ContentLayout>
          {isLoading && <Spinner fadeBgParentFixedPosition />}
          <StyledFlex gap="36px" alignItems="center" justifyContent="center">
            <StyledCard>
              <StyledFlex width="574px" pb="6px">
                <StyledFlex p="0 10px 0 6px" mb="28px">
                  <StyledText size={20} weight={600} mb={24}>
                    Edit Profile
                  </StyledText>
                  <StyledFlex position="relative" alignItems="center" justifyContent="center">
                    <StyledAvatar
                      src={croppedProfileImg?.img || profileImg}
                      alt={`${formik.values?.[ADD_USER.FIRST_NAME]} ${formik.values?.[ADD_USER.LAST_NAME]}`}
                      size={112}
                    >
                      {getNameInitials({
                        firstName: formik.values?.[ADD_USER.FIRST_NAME],
                        lastName: formik.values?.[ADD_USER.LAST_NAME],
                      })}
                    </StyledAvatar>
                    <StyledAvatarMask size={112} onClick={() => inputFileRef.current.click()}>
                      <AccessManagementIcons icon="CAMERA" width={22} />
                      <StyledText size={12} weight={600} cursor="pointer">
                        Change Image
                      </StyledText>
                      <input type="file" accept="image/*" hidden ref={inputFileRef} onChange={handleFileChange} />
                    </StyledAvatarMask>
                  </StyledFlex>
                </StyledFlex>
                <FormUserInfo formik={formik} />
                <StyledFlex alignItems="center" justifyContent="center">
                  <StyledButton primary variant="contained" onClick={formik.submitForm} disabled={!formik.dirty}>
                    Save Changes
                  </StyledButton>
                </StyledFlex>
              </StyledFlex>
            </StyledCard>
            <StyledCard>
              <StyledFlex px="4px" width="574px">
                <StyledText size={20} weight={600} mb={10}>
                  Security
                </StyledText>
                <StyledText size={16} weight={600}>
                  Password
                </StyledText>
                <StyledText size={16} weight={400} mb={10}>
                  {userId ? "Update the user's current password" : 'Update your current password'}
                </StyledText>
                <StyledFlex alignItems="flex-start">
                  <StyledButton variant="text" onClick={handleChangePassword}>
                    Change Password
                  </StyledButton>
                </StyledFlex>
              </StyledFlex>
            </StyledCard>
          </StyledFlex>
        </ContentLayout>
      </PageLayout>
    </>
  );
};

export default EditUser;
