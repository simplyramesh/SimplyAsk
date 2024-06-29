import styled from '@emotion/styled';

const handleStatusColor = (status) => {
  switch (status) {
    case 'Success':
      return 'color: #5f9936;background: #EBF2E6FF;';
    case 'Executing':
      return 'color: #e7bb09; background: #FCF7E0FF;';
    case 'Preparing':
    case 'Finalizing':
      return 'color: #3865a3; background: #E6ECF4FF;';
    case 'Failed':
      return 'color: #E03B24FF; background: #FBE7E4FF;';
    case 'Done':
      return 'color: #38780a; background: #e7f4de';
    case 'Assigned':
      return 'color: #E7BB09; background: #fcf7e0 ';
    case 'Unassigned':
      return 'color: #3865a3; background: #e3efff';
    default:
      return 'background: transparent;';
  }
};

const handleWidth = (sideModal) => {
  if (sideModal) {
    return `
      @media (max-width: 1200px) {
        width:  130px;
      }
  
      @media (max-width: 1000px) {
        width:  120px;
      }
  
      @media (max-width: 700px) {
        width:  100px;
      }
      
       width: 150px;
    `;
  }

  return '100px';
};

export const StyledTicketsStatus = styled.div`
  ${({ sideModal }) => handleWidth(sideModal)};
  ${({ status }) => handleStatusColor(status)};

  background-color: ${({ removeBackground }) => (removeBackground ? 'transparent' : '')};
  text-transform: ${({ capital }) => (capital ? 'uppercase' : 'capitalize')};
  border-radius: ${({ sideModal }) => (sideModal ? '15px' : '10px')};
  font-size: ${({ sideModal }) => (sideModal ? '20px' : '15px')};

  justify-content: center;
  padding: 0.4rem 1.5rem;
  align-items: center;
  font-weight: 600;
  display: flex;
  margin: auto;
`;
