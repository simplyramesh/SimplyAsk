const hotjarId = import.meta.env.VITE_HOTJAR_ID || 0;
const hotjarSnippetVersion = import.meta.env.VITE_HOTJAR_SV || 0;

const hotjarConfig = Object.freeze({
  production: {
    enabled: true,
    hjid: hotjarId,
    hjsv: hotjarSnippetVersion,
  },
  staging: {
    enabled: false,
    hjid: null,
    hjsv: null,
  },
  development: {
    enabled: false,
    hjid: null,
    hjsv: null,
  },
  telus: {
    enabled: false,
    hjid: null,
    hjsv: null,
  },
  rogers: {
    enabled: false,
    hjid: null,
    hjsv: null,
  },
});

export default hotjarConfig[process.env.NODE_ENV] || Object.freeze({ enabled: false });
