// Password generator
const SPECIAL_CHARACTERS_STRING = '!@#?%';

export const generateUUID = () => {
  let d = new Date().getTime(); // Timestamp
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16; // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      // eslint-disable-next-line no-bitwise
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      // eslint-disable-next-line no-bitwise
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    // eslint-disable-next-line no-bitwise,no-mixed-operators
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const randomCapitalLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);

const randomLowercaseLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);

const randomSpecialCharacter = () => SPECIAL_CHARACTERS_STRING[Math.floor(Math.random() * SPECIAL_CHARACTERS_STRING.length)];

const doesMatchLowercaseLetter = (character) => character.match(/[a-z]/g);

const doesMatchCapitalLetter = (character) => character.match(/[A-Z]/g);

const doesMatchNumber = (character) => character.match(/[0-9]/g);

const randomNumber = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const generateRandomPassword = () => {
  const uuidString = generateUUID();

  const randomNum = randomNumber(12, 24);

  const passwordArray = [];

  uuidString.split('').forEach((char) => {
    if (passwordArray.length >= randomNum) return;

    const currentPasswordString = passwordArray.join('');

    if (passwordArray.length === 11) {
      !doesMatchCapitalLetter(currentPasswordString) && passwordArray.push(randomCapitalLetter());
    }
    // uuid only has a-f
    if (doesMatchLowercaseLetter(char)) {
      passwordArray.push(randomLowercaseLetter());
    }

    if (doesMatchNumber(char)) {
      const passwordNumbersArray = doesMatchNumber(currentPasswordString);
      passwordNumbersArray && passwordNumbersArray.length >= 6
        ? passwordArray.push(randomCapitalLetter())
        : passwordArray.push(char);
    }

    if (char === '-') {
      const currentSpecial = randomSpecialCharacter();

      currentPasswordString.includes(currentSpecial)
        ? passwordArray.push(randomCapitalLetter())
        : passwordArray.push(currentSpecial);
    }
  });

  return passwordArray.sort(() => Math.random() - 0.5).join('');
};

// array methods
export const findDuplicatesInArray = (arrOne, arrTwo) => {
  if (!Array.isArray(arrOne) || !Array.isArray(arrTwo)) return [];

  const obj = {};

  const longArr = arrOne.length > arrTwo.length ? arrOne : arrTwo;
  const shortArr = arrOne.length > arrTwo.length ? arrTwo : arrOne;

  longArr.forEach((_, index) => {
    obj[longArr[index]] = `${longArr[index]}`;
  });

  return shortArr.filter((item) => obj[`${item}`]);
};

// dropdown filters
export const calendarFilter = (previous, value, action) => {
  const name = action ? action.name : value.name;

  if (!action) {
    const isDateRange = Array.isArray(value.filterValue);

    const before = { [`${name}Before`]: isDateRange ? value.filterValue[1] : value.filterValue };
    const after = { [`${name}After`]: isDateRange ? value.filterValue[0] : value.filterValue };

    const dateRange = isDateRange ? { ...before, ...after } : { ...after };

    return {
      ...previous,
      table: {
        ...previous.table,
        [name]: value.label,
      },
      api: {
        ...previous.api,
        ...dateRange,
      },
    };
  }

  return { ...previous };
};

export const isDifferent = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

// dropdown page permissions.
export const reorganizePermissions = (permissions) => {
  const pageGroupHeadings = [];
  const DEFAULT_PAGE_CATEGORY = 'Other';

  permissions.forEach((permission) => {
    const accessLevels = permission.apiPermissions.reduce((acc, value) => {
      if (value.permission.permissionType === 'PAGE_PERMISSION') return acc;
      const { permissionName } = value.permission || {};
      const isCustom = permissionName.includes('CUSTOM');
      const customAccessLevel = isCustom ? 'CUSTOM' : 'WRITE';
      const permissionAccessLevel = permissionName.includes('READ') ? 'READ' : customAccessLevel;

      return {
        ...acc,
        [permissionAccessLevel]: {
          ...value,
        },
      };
    }, {});

    pageGroupHeadings.push({
      ...permission,
      permission: {
        ...permission.permission,
        pageCategory: permission.permission.pageCategory || DEFAULT_PAGE_CATEGORY,
      },
      ...accessLevels,
    });
  });

  return pageGroupHeadings;
};

export const groupHeadingOrder = (heading) => {
  const groupHeading = heading.toLowerCase();

  switch (groupHeading) {
  case 'dashboards':
    return 1;
  case 'front office':
    return 2;
  case 'back office':
    return 3;
  case 'general':
    return 4;
  default:
    return 5;
  }
};

export const createPageGroupHeadings = (permissions, currentTablePermissions) => {
  if (!currentTablePermissions) return [];

  const pagePermissions = reorganizePermissions(permissions);
  const groupHeadings = pagePermissions.reduce((acc, curr) => {
    if (!curr.permission.pageCategory) return acc;
    const matchesTablePermission = currentTablePermissions?.find(
      ({ pagePermission }) => pagePermission?.id === curr?.id,
    );

    if (matchesTablePermission) return acc;

    const category = curr.permission.pageCategory;

    const pageCategory = acc.find((page) => page.label === category);

    if (pageCategory) pageCategory.options.push({ ...curr, customInfo: customAccessLevelInfo([curr]) });

    if (!pageCategory) {
      acc.push({
        label: category,
        order: groupHeadingOrder(category),
        options: [{ ...curr, customInfo: customAccessLevelInfo([curr]) }],
      });
    }

    return acc;
  }, []);

  return groupHeadings.sort((a, b) => a.order - b.order);
};

// CUSTOM Access Levels
export const reorganizeFeaturesByFeatureType = (permission) => {
  const pagePermissionFeatures = permission.pagePermissionFeatures?.reduce((acc, item) => {
    if (!acc[item.featureType]) return { ...acc, [item.featureType]: [item] };

    return {
      ...acc,
      [item.featureType]: [...acc[item.featureType], item],
    };
  }, {});

  return pagePermissionFeatures;
};

export const pagePermissionFeatures = (responseData) => {
  const data = responseData?.content != null ? responseData.content : responseData;

  const pagePermissionFeatureObject = data.reduce((acc, item) => ({
    parentPageOrganizationPermissionId: item.id,
    parentPagePermissionFeatures: {
      pagePermissionFeatures: item.permission?.pagePermissionFeatures,
      pagePermissionFeatureTypes: { ...reorganizeFeaturesByFeatureType(item.permission) },
    },
    parentPagePermissionFeatureIds: item.permission?.pagePermissionFeatures.map((feature) => feature.id),
  }), {});

  return pagePermissionFeatureObject;
};

export const organizeApiPermissionAccessLevels = (responseData) => {
  const data = responseData?.content != null ? responseData.content : responseData;

  return reorganizePermissions(data);
};

export const findAccessLevelApiFeatures = (responseData, accessLevel) => {
  const accessLevelFeatures = organizeApiPermissionAccessLevels(responseData).reduce((acc, pagePermission) => {
    if (pagePermission[accessLevel]) {
      return {
        ...acc,
        apiPermissionFeatures: pagePermission[accessLevel].permission?.apiPermissionFeatures,
        apiPermissionFeatureIds: pagePermission[accessLevel].permission?.apiPermissionFeatures.map(
          (feature) => feature.id,
        ),
      };
    }

    return acc;
  }, {});

  return accessLevelFeatures;
};

export const enabledDisabledApiPermissionFeatures = (pageFeatures, apiFeatures) => {
  const apiFeatureIds = apiFeatures?.apiPermissionFeatureIds || [];
  const pageFeatureIds = pageFeatures?.parentPagePermissionFeatureIds || [];

  const enabledFeatures = findDuplicatesInArray(apiFeatureIds, pageFeatureIds);
  const disabledFeatures = pageFeatures?.parentPagePermissionFeatureIds.filter(
    (feature) => !apiFeatures?.apiPermissionFeatureIds?.includes(feature),
  );

  return {
    enabledFeatureIds: enabledFeatures || [],
    disabledFeatureIds: disabledFeatures || [],
  };
};

export const customAccessLevelInfo = (responseData) => {
  const pagePermission = responseData?.content ? reorganizePermissions(responseData.content)[0] : responseData[0];

  const fullAccessLevelFeatures = findAccessLevelApiFeatures(responseData, 'WRITE');

  const viewOnlyAccessLevelFeatures = findAccessLevelApiFeatures(responseData, 'READ');

  const customAccessLevelFeatures = findAccessLevelApiFeatures(responseData, 'CUSTOM');

  const pageFeatures = pagePermissionFeatures(responseData);

  const fullAccessEnabledDisabledFeatures = enabledDisabledApiPermissionFeatures(pageFeatures, fullAccessLevelFeatures);

  const viewOnlyEnabledDisabledFeatures = enabledDisabledApiPermissionFeatures(
    pageFeatures,
    viewOnlyAccessLevelFeatures,
  );

  const customEnabledDisabledFeatures = enabledDisabledApiPermissionFeatures(pageFeatures, customAccessLevelFeatures);

  return {
    pagePermission,
    permissionFeatureTypes: pageFeatures?.parentPagePermissionFeatures?.pagePermissionFeatureTypes,
    pagePermissionFeatures: pageFeatures?.parentPagePermissionFeatures?.pagePermissionFeatures,
    WRITE: {
      ...fullAccessLevelFeatures,
      ...fullAccessEnabledDisabledFeatures,
    },
    READ: {
      ...viewOnlyAccessLevelFeatures,
      ...viewOnlyEnabledDisabledFeatures,
    },
    CUSTOM: {
      ...customAccessLevelFeatures,
      enabledFeatureIds: pagePermission?.CUSTOM
        ? customEnabledDisabledFeatures.enabledFeatureIds
        : customEnabledDisabledFeatures.disabledFeatureIds,
      disabledFeatureIds: pagePermission?.CUSTOM ? customEnabledDisabledFeatures.disabledFeatureIds : [],
    },
  };
};
