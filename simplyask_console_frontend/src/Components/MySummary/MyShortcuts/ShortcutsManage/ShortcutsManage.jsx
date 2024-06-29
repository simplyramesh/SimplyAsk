import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import CustomCheckboxOptions from '../../../Settings/AccessManagement/components/dropdowns/customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../../../Settings/AccessManagement/components/dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import FormErrorMessage from '../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import SearchBar from '../../../shared/SearchBar/SearchBar';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import ShortcutList from '../component/ShortcutList/ShortcutList';
import {
  ShortcutsManageHandler,
  ShortcutsManageHolder,
  StyledLabel,
  StyledSelectChapter,
  StyledShortcutsFilterResult,
  StyledShortcutsFilters,
  StyledShortcutsFiltersHolder,
} from './StyledShortcutsManage';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { LoadingMessage } from '../../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemAdd/CustomSelectComponents';
import NoOptionsMessage from '../../../shared/REDISIGNED/selectMenus/customComponents/options/NoOptionsMessage';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { searchShortcuts } from '../../../../Services/axios/shortcuts';
import { useCreateShortcut } from '../../../../hooks/shortcuts/useCreateShortcut';
import { useRecoilValue } from 'recoil';
import { mappedGrantedPagesSelector } from '../../../../store/selectors';
import { matchPath } from 'react-router-dom';

const ShortcutsManage = ({ data, isShortcutsFetching }) => {
  const { colors } = useTheme();

  const [shortcuts, setShortcuts] = useState();
  // eslint-disable-next-line no-unused-vars
  const [filteredShortcuts, setFilteredShortcuts] = useState();
  const [isShortcutInvalid] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [chapterFilter, setChapterFilter] = useState([]);
  const [searchText, setSearchText] = useState();

  const grantedPages = useRecoilValue(mappedGrantedPagesSelector);

  const { createShortcut } = useCreateShortcut();

  useEffect(() => {
    setShortcuts(data);
  }, [data]);

  useEffect(() => {
    if (!shortcuts) return;

    let filterShortcuts = [...shortcuts];

    if (searchText) {
      filterShortcuts = filterShortcuts.filter((item) =>
        item?.label?.toLowerCase().includes(searchText?.toLowerCase())
      );
    }

    if (chapterFilter && chapterFilter.length) {
      filterShortcuts = filterShortcuts.filter((x) => chapterFilter.includes(x?.chapter));
    }

    setFilteredShortcuts(filterShortcuts);
  }, [shortcuts, chapterFilter, searchText]);

  const handleCreateShortcut = ({ name, url: pageUrl, description }) => {
    createShortcut({
      name,
      pageUrl,
      description,
      order: shortcuts.length + 1,
    });
  };

  const handleChangeChapter = (chapters) => {
    const chaptersName = chapters.map((item) => item.chapter);
    setChapterFilter(chaptersName);
  };

  const handleLoad = async (searchText) => {
    const seenUrls = new Set();

    const res = await searchShortcuts(searchText);

    const shortcutsOptions = res?.filter((obj) => {
      if (!obj?.url) return false;

      const isUnique = !seenUrls.has(obj.url);

      if (isUnique) {
        seenUrls.add(obj.url);
        return true;
      }

      return false;
    });

    const filteredShortcutOptions = shortcutsOptions.filter((shortcut) =>
      grantedPages.some((page) => matchPath({ path: page.pageUrlPath, caseSensitive: true, end: true }, shortcut.url))
    );

    return filteredShortcutOptions;
  };

  return (
    <ShortcutsManageHolder>
      <ShortcutsManageHandler>
        <StyledFlex>
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" w="100%">
            <StyledText size={16} lh={20} weight={700}>
              My Shortcuts
            </StyledText>

            <StyledTooltip
              title={showFilters ? 'Close All Filters' : 'View All Filters'}
              arrow
              placement="top"
              p="3px 15px"
              size="12px"
              lh="1.5"
              weight="500"
              radius="25px"
            >
              <CustomTableIcons
                icon="FILTER"
                width={16}
                padding="9px"
                bgColor={showFilters ? colors.lightGray : colors.dividerColor}
                bgColorHover={colors.lightGray}
                radius="50%"
                onClick={() => setShowFilters(!showFilters)}
              />
            </StyledTooltip>
          </StyledFlex>

          <StyledText p="0 20px 0 0">
            Add and delete shortcuts. Reorder shortcuts by dragging and dropping them into the desired positions.
          </StyledText>
        </StyledFlex>

        <StyledFlex direction="column" gap="8px">
          <CustomSelect
            defaultOptions
            isAsync
            loadOptions={handleLoad}
            placeholder="Search for the page name or insert URL..."
            form
            value={null}
            closeMenuOnSelect
            closeMenuOnScroll
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.url}
            onChange={handleCreateShortcut}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              NoOptionsMessage,
              LoadingMessage,
            }}
          />
          {isShortcutInvalid && <FormErrorMessage>A valid page name or page URL is required</FormErrorMessage>}
        </StyledFlex>

        <StyledShortcutsFiltersHolder shown={showFilters}>
          <StyledShortcutsFilters>
            <SearchBar placeholder="Search Existing Shortcuts" onChange={(e) => setSearchText(e.target.value)} />

            <StyledFlex direction="row" gap="20px" alignItems="center">
              <StyledLabel>Showing</StyledLabel>
              <StyledSelectChapter
                name="shortcuts-type"
                placeholder="All Shortcuts"
                components={{ DropdownIndicator: CustomDropdownIndicator, Option: CustomCheckboxOptions }}
                options={shortcuts}
                getOptionLabel={(option) => option?.label}
                getOptionValue={(option) => option?.chapter}
                onChange={handleChangeChapter}
                isMulti
                labelKey="label"
                valueKey="id"
              />
            </StyledFlex>
          </StyledShortcutsFilters>
        </StyledShortcutsFiltersHolder>
      </ShortcutsManageHandler>

      <StyledShortcutsFilterResult>
        <ShortcutList
          list={filteredShortcuts}
          editable
          isShortcutsFetching={isShortcutsFetching}
          isDragDisabled={false}
        />
      </StyledShortcutsFilterResult>
    </ShortcutsManageHolder>
  );
};

export default ShortcutsManage;

ShortcutsManage.propTypes = {};
