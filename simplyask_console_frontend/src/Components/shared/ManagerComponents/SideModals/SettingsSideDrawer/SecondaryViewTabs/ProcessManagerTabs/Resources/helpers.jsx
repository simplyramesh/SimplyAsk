export const matchValidation = (validationType) => {
  const validationMapping = {
    NUMBER: {
      value: 123,
    },
    ADDRESS: {
      value: 'Abc, 123',
    },
    GENERIC: {
      value: 'A1 true',
    },
    BOOLEAN: {
      value: true,
    },
    PHONE_NUMBER: {
      value: '0000000000',
    },
    'FLOAT NUMBER': {
      value: 0.0,
    },
    ALPHANUMERIC: {
      value: 'Abcdef 123',
    },
    ALPHABET: {
      value: 'John',
    },
    OBJECT: {
      value: {},
    },
    DATE_OF_BIRTH: {
      value: '2000-12-30',
    },
    POSTAL_CODE: {
      value: 'ABC 123',
    },
    EMAIL: {
      value: 'abc@email.com',
    },
    ZIP_CODE: {
      value: '00000',
    },
  };

  return validationMapping[validationType]
    ? {
      validationType,
      value: validationMapping[validationType].value,
    }
    : {
      validationType,
      value: '<Add your value here>',
    };
};
