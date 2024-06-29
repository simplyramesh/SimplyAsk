import React from 'react';
import { StyledMyShortcutsHeader, StyledMyShortcutsPart } from '../ShortcutsSection/StyledShortcutsSection';
import { StyledText } from '../../../shared/styles/styled';
import ShortcutItem from '../component/ShortcutItem/ShortcutItem';
import { StyledShortcutList } from '../component/ShortcutList/StyledShortcutList';
import { useRecoilValue } from 'recoil';
import { mappedGrantedPagesSelector, recentlyViewedPagesSelector } from '../../../../store/selectors';
import { getShortcutInfo } from '../../helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '../../../../config/routes';

const RecentlyViewed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recentlyViewedPages = useRecoilValue(recentlyViewedPagesSelector);
  const grantedPages = useRecoilValue(mappedGrantedPagesSelector);

  const handleClick = (item) => {
    navigate(item?.urlKey);
  };

  return (
    <StyledMyShortcutsPart>
      <StyledMyShortcutsHeader>
        <StyledText size={16} lh={20} weight={700}>Recently Viewed</StyledText>
      </StyledMyShortcutsHeader>
      <StyledShortcutList >
        {recentlyViewedPages
          ?.filter(path => path !== location.pathname && path !== routes.DEFAULT)
          .map((item, index) => getShortcutInfo(item, index, grantedPages))?.map((item, index) => (
            <ShortcutItem
              key={index}
              shortcut={item}
              editable={false}
              handleSelect={handleClick}
            />
          ))}
      </StyledShortcutList>
    </StyledMyShortcutsPart>
  );
};

export default RecentlyViewed;
