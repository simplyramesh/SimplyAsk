/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import '../transition.css';

import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import expandIconSrc from '../../../../../Assets/icons/dropdownIconPng.png';
import collapseIconSrc from '../../../../../Assets/icons/dropdownUpIconPng.png';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import ChevronLeftIcon from '../../../Assets/Icons/chevronLeft.svg?component';
import { expandAllStepsState, stepDelegeatesStructureState, workflowState } from '../../../store';
import RectangularStep from '../../diagram/steps/RectangularStep/RectangularStep';
import { Settings } from '../../sideMenu';
import { StyledFlowDynamicSideModalContainer, StyledNavTabsRoot, StyledSideDrawerModal, StyledStepNode, StyledTabContentContainer } from './StyledSingleScreenSideModalModule';
import useTabs from '../../../../../hooks/useTabs';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledToggleIconWrapper, StyledToggleWrapper } from '../../sideMenu/SideMenu/StyledSideMenuModule';

const ExpandIcon = () => <img src={expandIconSrc} alt="Expand Icon" width={14} height={8} />;
const CollapseIcon = () => <img src={collapseIconSrc} alt="Collapse Icon" width={14} height={8} />;

const SingleScreenDynamicSideModal = ({
  tabsSingleScreenDataSchema = [],
  showModal = false,
  setShowModal = () => { },
  onFilter = () => { },
}) => {
  const [renderedTab, setRenderedTab] = useState(tabsSingleScreenDataSchema[0]?.component);
  const { tabValue, onTabChange } = useTabs(0);
  const { colors } = useTheme();

  useEffect(() => {
    if (tabsSingleScreenDataSchema) {
      if (
        !tabsSingleScreenDataSchema[0]?.isListView &&
        tabsSingleScreenDataSchema[0]?.pureStepComponentData?.length > 0
      ) {
        setRenderedTab(<StepViewPureComponent data={tabsSingleScreenDataSchema[0]?.pureStepComponentData} />);
      }
    }
  }, [tabsSingleScreenDataSchema]);

  const StepViewPureComponent = () => {
    const stepDelegatesStructureData = useRecoilValue(stepDelegeatesStructureState);
    const { processType } = useRecoilValue(workflowState);
    const { content: stepDelegatesStructure, totalRecords, totalElements, isLoading } = stepDelegatesStructureData;
    const [filteredData, setFilteredData] = useState();
    const [searchInputValue, setSearchInputValue] = useState('');

    useEffect(() => {
      if (searchInputValue) {
        const filterParams = {
          stepDelegateName: searchInputValue,
          processType: processType?.name,
        };

        onFilter(filterParams).then(({ content, totalRecords, totalElements }) => {
          setFilteredData({ content, totalRecords, totalElements });
        });
      } else {
        setFilteredData(null);
      }
    }, [searchInputValue]);

    const searchBarHandler = (event) => {
      setSearchInputValue(event.target.value);
    };

    if (isLoading) return <Spinner small parent />;

    const TreeView = ({ data }) => {
      const [expanded, setExpanded] = useState([]);

      const expandAllSteps = useRecoilValue(expandAllStepsState);

      useEffect(() => {
        if (expandAllSteps) {
          const nodesIdToExpand = data.map((node) => node.stepCategoryId);
          setExpanded(nodesIdToExpand);
        } else {
          setExpanded([]);
        }
      }, [expandAllSteps])

      const toggleNode = (id) => {
        if (expanded.includes(id)) {
          setExpanded(expanded.filter((nodeId) => nodeId !== id));
        } else {
          setExpanded([...expanded, id]);
        }
      };

      const renderNode = (node, index) => {
        const isExpanded = expanded.includes(node.stepCategoryId);

        return (
          <StyledFlex key={node.stepCategoryId} mt={index > 0 ? 2 : 0}>
            <StyledStepNode onClick={() => toggleNode(node.stepCategoryId)}>
              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
              <StyledText weight={600} size={16} lh={21} color={colors.primary}>
                {node.stepCategoryName}
              </StyledText>
            </StyledStepNode>

            {isExpanded && (
              <StyledFlex pt={2.5} rowGap={2.5}>
                {node.children && node.children.length > 0 && (
                  <StyledFlex ml={3}>{node.children.map(renderNode)}</StyledFlex>
                )}
                {node.stepDelegates && node.stepDelegates.length > 0 && (
                  <StyledFlex rowGap={2}>
                    {node.stepDelegates.map((step) => (
                      <RectangularStep item={step} key={step.stepDelegateId} />
                    ))}
                  </StyledFlex>
                )}
                {!node.children?.length && !node.stepDelegates?.length && (
                  <StyledText color={colors.optional}>No Data</StyledText>
                )}
              </StyledFlex>
            )}
          </StyledFlex>
        );
      };

      return <StyledFlex gap={3}>{data.map(renderNode)}</StyledFlex>;
    };

    const FilteredList = () => {
      return filteredData && filteredData.content && filteredData.content.length ? (
        <StyledFlex rowGap={2}>
          {filteredData.content.map((item) => (
            <RectangularStep item={item} key={item.stepDelegateId} />
          ))}
        </StyledFlex>
      ) : (
        <StyledFlex rowGap={1} pt={2} ml={3} mr={3} justifyContent="center">
          <StyledText textAlign="center" weight={600}>
            No Results Found
          </StyledText>
          <StyledText textAlign="center">Try adjusting your search to find what you are looking for.</StyledText>
        </StyledFlex>
      );
    };

    const TreeList = () => <TreeView data={stepDelegatesStructure} />;

    return (
      <StyledFlex m={3} mt={4}>
        <StyledFlex mb="25px">
          <SearchBar
            placeholder="Search for Steps..."
            onChange={searchBarHandler}
          />
        </StyledFlex>

        <StyledFlex
          direction="row"
          fontSize={13}
          lineHeight={1.15}
          fontWeight={500}
          color={colors.information}
          mb={3}
          gap={0.5}
        >
          Showing
          <StyledText weight={700} size={13} lh="inherit">
            {filteredData ? filteredData.totalElements : totalElements}
          </StyledText>
          out of
          <StyledText weight={700} size={13} lh="inherit">
            {filteredData ? filteredData.totalRecords : totalRecords}
          </StyledText>
          steps
        </StyledFlex>

        {searchInputValue.length > 0 ? <FilteredList /> : <TreeList />}
      </StyledFlex>
    );
  };

  const FallbackComponent = () => <StyledFlex>Unable to load component</StyledFlex>;

  const onTabValueChange = (event, newValue) => {
    if (
      !tabsSingleScreenDataSchema[newValue]?.isListView &&
      tabsSingleScreenDataSchema[newValue]?.pureStepComponentData?.length > 0
    ) {
      setRenderedTab(<StepViewPureComponent data={tabsSingleScreenDataSchema[newValue]?.pureStepComponentData} />);
    } else if (!tabsSingleScreenDataSchema[newValue]?.isListView && tabsSingleScreenDataSchema[newValue]?.component) {
      setRenderedTab(tabsSingleScreenDataSchema[newValue]?.component ?? FallbackComponent);
    } else {
      setRenderedTab(<Settings />);
    }

    onTabChange(event, newValue);
  };

  return (
    <StyledFlowDynamicSideModalContainer dataExpanded={showModal}>
      <StyledToggleWrapper onClick={() => setShowModal((prev) => !prev)} isDefaultMenuOpen={showModal}>
        <StyledToggleIconWrapper isDefaultMenuOpen={showModal}>
          <ChevronLeftIcon />
        </StyledToggleIconWrapper>
      </StyledToggleWrapper>
      <StyledFlex
        overflow="hidden"
        height="100%"
        flex="1 1 auto"
      >
        <StyledSideDrawerModal
          show
          hasCloseButton={false}
          disableBackdropColor
          noPortal
        >
          <StyledNavTabsRoot
            labels={tabsSingleScreenDataSchema?.map((item) => ({ title: item.title }))}
            value={tabValue}
            onChange={onTabValueChange}
          />
          <StyledTabContentContainer>{renderedTab}</StyledTabContentContainer>
        </StyledSideDrawerModal>
      </StyledFlex>
    </StyledFlowDynamicSideModalContainer>
  );
};

export default SingleScreenDynamicSideModal;

SingleScreenDynamicSideModal.propTypes = {
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
  onFilter: PropTypes.func,
  tabsSingleScreenDataSchema: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      pureStepComponentData: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          body: PropTypes.string,
          Icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        })
      ),
      component: PropTypes.func,
      isListView: PropTypes.bool,
      listViewData: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          body: PropTypes.string,
          onClickComponent: PropTypes.func,
        })
      ),
    })
  ),
};
