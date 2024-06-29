import { useTheme } from '@mui/material';
import ReactTextareaCodeEditor from '@uiw/react-textarea-code-editor';

const CodeEditor = ({ value, onChange, language, minHeight, isError, style, ...rest }) => {
  const { colors } = useTheme();

  return (
    <ReactTextareaCodeEditor
      value={value}
      onChange={onChange}
      language={language}
      minHeight={minHeight || 120}
      style={{
        fontSize: 15,
        backgroundColor: colors.white,
        fontFamily: 'Montserrat',
        border: `1px solid ${isError ? colors.validationError : colors.primary}`,
        borderRadius: '10px',
        color: colors.primary,
        ...style,
      }}
      {...rest}
    />
  );
};

export default CodeEditor;
