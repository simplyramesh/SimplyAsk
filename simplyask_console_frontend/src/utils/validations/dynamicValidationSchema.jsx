import * as Yup from 'yup';

const getParams = (field, type) => {
  if (field?.params == null || !field?.params[type]) return [];

  return Array.isArray(field.params[type])
    ? field.params[type]
    : [field.params[type]];
};

/*
Purposefully limited - for example:

validations: ['array', 'of']
params: {
  of: ['object'] <- will not work
  of: Yup.object() <- will work
}

*/

export const createValidationSchema = (fields = []) => {
  const schema = fields.reduce((acc, field) => {
    if (field?.validations?.length > 0) {
      const assignParams = field.validations.reduce(
        (yup, type) => yup[type](...getParams(field, type)).default(field?.default || ''),
        { ...Yup },
      );

      acc[field.name] = assignParams;
    }

    return acc;
  }, {});

  return Yup.object().shape({ ...schema });
};

/*
** Example:

  * params are optional

const fields = [
  {
    name: "username",
    validations: ["string", "strict", "trim", "min", "max", "required"], <- matches available validations in yup
    default: '',
    params: {
      min: 3, <- min matches validation in validations array
      max: 20,
      required: "Username is required"
    }
  },
  {
    name: "email",
    validations: ["string", "email", "trim", "required"],
    default: '',
    params: {
      required: "Email is required"
    }
  },
  {
    name: "isBig",
    validations: ["boolean"],
    default: false,
    params: {}
  },
  {
    name: "count",
    validations: ["number", "when"],
    default: 0,
    params: {
      when: [
        "isBig",
        {
          is: true,
          then: {
            min: 5
          },
          otherwise: {
            min: 0
          }
        }
      ]
    }
  }
];

const validationSchema = createValidationSchema(fields);

** Test (without Formik):

validationSchema
  .validate({
    username: "a",
    email: "a",
    isBig: true,
    count: 1
  })
  .then(() => console.log("Valid"))
  .catch(err => console.log(err));

*/
