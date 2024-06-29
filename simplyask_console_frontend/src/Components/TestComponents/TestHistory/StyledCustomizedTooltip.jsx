import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomizedTooltip = styled(({ className, ...props }) => (<Tooltip {...props} classes={{ popper: className }} />))({
  [`& .${tooltipClasses.tooltip}`]: {
    zIndex: 5003,
    maxWidth: 'none',
    boxShadow: '0 0 10px rgba(0,0,0, .3)',
    borderRadius: '30px',
    padding: '10px 15px',
    backgroundColor: 'white',
    marginBottom: '26px !important',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'white',
    fontSize: '2rem',
    '&:before': {
      boxShadow: '0 0 5px 1px rgb(0, 0, 0, .2)',
      borderRadius: '5px 0 5px 0',
    },
  },
});
