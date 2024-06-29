export const convertToTitleCaseArr = (str) => {
  const cleanStr = typeof str !== 'string' || str === '' ? '---' : str;

  const titleizedArray = cleanStr?.split(',').map((word) => {
    const titleized = `${word?.charAt(0)?.toUpperCase()}${word?.slice(1)}`;

    return titleized?.split(/(?=[A-Z])/)?.join(' ');
  });

  return titleizedArray;
};

// Expecting key value pairs within an object to be key=value not key:value
// If key: value, convertToJson will error, because when adding quotes, ':' is included as part of the string to be quoted to account for urls.
// Example: "https://www.symphona.ai", "key:value" <-- will cause parsing error because it needs to be "key":"value"
const addDoubleQuotes = (str) => {
  const trimmedStr = str.trim();
  const regexAlphaNumericAndSymbolsToWrapWithQuotes = /[a-zA-Z0-9-_.:@!#$%&//\\\s]+/g;
  const addValueIfNone = trimmedStr.charAt(trimmedStr.length - 1) === '=' ? `${trimmedStr}""` : trimmedStr;

  return addValueIfNone.replace(regexAlphaNumericAndSymbolsToWrapWithQuotes, (match) => {
    const trimmedMatch = match.trim();

    if (Number(trimmedMatch)) return Number(trimmedMatch);

    switch (trimmedMatch) {
      case 'null':
        return null;
      case 'true':
        return true;
      case 'false':
        return false;
      case 'undefined':
        return '"---"';
      default:
        return `"${trimmedMatch}"`;
    }
  });
};

const convertStrToJson = (str) => {
  const cleanStrForParse = `${str == null || str === '""' ? '---' : str}`
    .split(',')
    .map((v) => (v.trim() === '' ? addDoubleQuotes('---') : addDoubleQuotes(v.trim())))
    .join(',')
    .replace(/=/g, ':');

  const parsedJson = JSON.parse(`[${cleanStrForParse}]`);
  return parsedJson;
};

const addDashToShortArray = (headerArr, dataArr) => {
  if (headerArr?.length === dataArr?.length) return { headerArr, dataArr };

  const shortArray = headerArr?.length < dataArr?.length ? headerArr : dataArr;
  const longArray = headerArr?.length > dataArr?.length ? headerArr : dataArr;
  const diff = longArray?.length - shortArray?.length;
  const dashArr = Array(diff)?.fill('---');

  if (headerArr?.length > dataArr?.length) {
    return { headerArr, dataArr: [...dataArr, ...dashArr] };
  }

  if (headerArr?.length < dataArr?.length) {
    return { headerArr: [...headerArr, ...dashArr], dataArr };
  }
};
