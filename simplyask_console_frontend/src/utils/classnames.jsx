// function is useful when we want to conditionally apply a CSS class to an element
// saves us from having to use Template Literals (`${}`)
// Function filters out false, undefined, null and just in case, repeated classes
// usage:
// className={classnames(classes.example, isExample && classes.example_active, isExample2 ? classes.example2_active : example2, ...)}
// OR
// if two or more classes need to be in the className={}
// className={classnames(classes.example, classes.example2, ...)}
export const classnames = (...classNames) => {
  const filteredClassNames = classNames
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(' ');

  return filteredClassNames;
};
