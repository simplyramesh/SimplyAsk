import ReactJson from 'react-json-view';

const jsonTheme = {
  // Bg color
  base00: '#2d3a4705',
  base01: '#ddd',
  // Line beneath caret and to the left of expanded object or array
  base02: '#2d3a4725',
  base03: '#444',
  base04: 'purple',
  base05: '#444',
  base06: '#444',
  // Key color #F57B20
  base07: '#2d3a47',
  base08: '#444',
  // Value: string color
  base09: '#E03B24',
  base0A: 'rgba(70, 70, 230, 1)',
  base0B: 'rgba(70, 70, 230, 1)',
  base0C: 'rgba(70, 70, 230, 1)',
  // Caret color (expanded)
  base0D: '#2d3a47',
  // Caret (collapsed) and Boolean color
  base0E: '#5F9936',
  // Integer color
  base0F: '#F57B20',
};

const jsonStyles = {
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: '"Montserrat", sans-serif',
  flex: '1 1 auto',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '5px',
  padding: '8px',
  backgroundColor: '#ffffff',
};

const JsonViewer = ({ jsonData, theme, styles, ...props }) => {
  return (
    <ReactJson
      src={jsonData}
      name={false}
      enableClipboard={false}
      collapsed={false}
      displayObjectSize={false}
      displayDataTypes={false}
      collapseStringsAfterLength={15}
      style={{ ...jsonStyles, ...styles }}
      theme={{ ...{ ...jsonTheme, ...(theme || {}) } }}
      {...props}
    />
  );
};

export default JsonViewer;

JsonViewer.propTypes = ReactJson.propTypes;
