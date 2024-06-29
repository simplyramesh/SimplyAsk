import { StyledFlex } from '../../../styles/styled';
import { StyledViewOnlySignature } from './StyledSignature';

const ViewOnlySignature = ({ src, alt, containerRef }) => {
  return (
    <StyledFlex alignSelf="flex-start" flex="auto" ref={containerRef}>
      <StyledViewOnlySignature src={src} alt={alt} />
    </StyledFlex>
  );
};

export default ViewOnlySignature;
