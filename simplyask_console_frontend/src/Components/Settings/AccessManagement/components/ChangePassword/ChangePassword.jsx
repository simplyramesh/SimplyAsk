import { useQuery, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../../config/routes';
import { useUser } from '../../../../../contexts/UserContext';
import { getUserById } from '../../../../../Services/axios/permissionsUsers';
import { changePassword } from '../../../../../Services/axios/userAxios';
import { modifiedCurrentPageDetails } from '../../../../../store';
import { StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ADD_USER } from '../../constants/apiConstants';
import { CHANGE_PASSWORD_VALIDATION_SCHEMA } from '../../utils/validations';
import NewPassword from '../NewPassword/NewPassword';

const INIT_VALUES = {
  password: '',
  confirmPassword: '',
};

const ChangePassword = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { id: userId } = useParams();
  const { user: authUser } = useUser();
  const navigate = useNavigate();

  const getId = () => userId || authUser?.id || null;

  const { data: userData } = useQuery({
    queryKey: ['getUser', getId()],
    queryFn: () => getUserById(getId()),
    enabled: !!getId(),
  });

  useEffect(() => {
    if (userId && userData) {
      setCurrentPageDetailsState({
        disableBreadCrumbLoading: true,
        pageUrlPath: routes.SETTINGS_ACCESS_MANAGER_USER_CHANGE_PASSWORD,
        clickableIdRoutes: [
          {
            path: routes.SETTINGS_ACCESS_MANAGER_EDIT_USER,
            clickablePath: generatePath(routes.SETTINGS_ACCESS_MANAGER_EDIT_USER, { id: userId }),
          },
          {
            breadCrumbLabel: userData.fullname,
            path: routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS,
            clickablePath: generatePath(routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS, { id: userId }),
          },
        ],
      });
    }
  }, [userId, userData]);

  const { mutate: changePasswordApi, isPending: isChangePasswordLoading } = useMutation({
    mutationFn: ({ email, newPassword }) => changePassword({ email, newPassword }),
    onSuccess: (data, variables) => {
      toast.success(`${variables?.userData?.fullname}'s password changed successfully`);

      formik.resetForm(INIT_VALUES);
      navigate(-1);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const handleChangePassword = async () => {
    const updatedUser = {
      email: userData?.[ADD_USER.EMAIL],
      newPassword: formik.values[ADD_USER.PASSWORD],
      userData,
    };

    changePasswordApi(updatedUser);
  };

  const formik = useFormik({
    initialValues: INIT_VALUES,
    validationSchema: CHANGE_PASSWORD_VALIDATION_SCHEMA,
    onSubmit: handleChangePassword,
  });

  return (
    <PageLayout>
      <ContentLayout>
        <StyledFlex alignItems="center" justifyContent="center">
          <StyledCard>
            <StyledFlex width="538px">
              <StyledFlex mb="10px">
                <StyledText as="h3" size="20" weight="600" mb={28}>
                  {userId ? 'Change User Password' : 'Change Your Password'}
                </StyledText>
                <NewPassword formik={formik} />
              </StyledFlex>
              <StyledFlex alignItems="center" justifyContent="center" mb="6px">
                <StyledLoadingButton
                  onClick={formik.submitForm}
                  disabled={!formik.isValid || isChangePasswordLoading}
                  minWidth="180px"

                >
                  {isChangePasswordLoading ? <Spinner inline small />
                    : 'Save New Password'}
                </StyledLoadingButton>
              </StyledFlex>
            </StyledFlex>
          </StyledCard>
        </StyledFlex>
      </ContentLayout>
    </PageLayout>
  );
};

export default ChangePassword;
