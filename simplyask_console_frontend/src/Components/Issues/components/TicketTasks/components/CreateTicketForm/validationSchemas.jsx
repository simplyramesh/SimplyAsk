import * as Yup from 'yup';

export const createTicketSchema = Yup.object().shape({
  displayName: Yup.string().nullable().required('Name is required'),
  issueTypeId: Yup.number().nullable().required('Issue Type is required'),
  additionalFields: Yup.object(),
});

export const createTicketTaskSchema = Yup.object().shape({
  displayName: Yup.string().required('Name is required'),
  issueTypeId: Yup.object().required('Type is required'),
  description: Yup.string().nullable(),
  assignedToUserId: Yup.object().nullable(),
  parentId: Yup.object()
  .nullable()
  .when('$ticketId', {
    is: (ticketId) => !ticketId,
    then: Yup.object().required('Associated Service Ticket is required'),
    otherwise: Yup.object().nullable(),
  }),
});

export const createNewPhoneNumberSchema = Yup.object().shape({
  country: Yup.object().nullable().required('Country is required'),
});
