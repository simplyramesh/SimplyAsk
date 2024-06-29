import React from 'react';
import {
  StyledDivider,
  StyledFlex,
  StyledSwitch,
  StyledText,
  StyledTextField,
} from '../../../../../../../shared/styles/styled';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledKnowledgeBaseSlider } from '../../StyledSimplyAssistantKnowledgeBases';
import { validateSliderChange, SLIDER_FIELD_NAMES, SWITCH_FIELD_NAMES, SLIDER_MAX_VALUES } from '../../utils/constants';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';

const KnowledgeSourceFormWebsiteModal = ({
  values,
  setFieldValue,
  handleBlur,
  errors,
  touched,
  shouldCrawlWebsite,
  setShouldCrawlWebsite,
  shouldAutoUpdateFrequency,
  setShouldAutoUpdateFrequency,
}) => {
  const renderSwitchAndLabel = ({ fieldName, labelSize, labelWeight, labelTitle, setFn, tooltipTitle }) => (
    <StyledFlex flexDirection="row" alignItems="center" gap="10px">
      <StyledSwitch
        checked={setFn ? fieldName : values[fieldName]}
        onChange={(e) => (setFn ? setFn(e.target.checked) : setFieldValue(fieldName, e.target.checked))}
      />
      <InputLabel size={labelSize} weight={labelWeight} label={labelTitle} mb={0} />
      <StyledTooltip arrow placement="top" title={tooltipTitle} p="10px 15px">
        <InfoOutlined fontSize="inherit" />
      </StyledTooltip>
    </StyledFlex>
  );

  const renderSliderAndLabel = ({ fieldName, labelTitle, sliderValue, tooltipTitle }) => {
    return (
      <StyledFlex gap="12px">
        <StyledFlex flexDirection="row" gap="10px" alignItems="center">
          <InputLabel size={16} label={labelTitle} mb={0} />
          <StyledTooltip arrow placement="top" title={tooltipTitle || ''} p="10px 15px">
            <StyledFlex as="span">{tooltipTitle && <InfoOutlined fontSize="inherit" />}</StyledFlex>
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex flexDirection="row" alignItems="center" gap="30px">
          <StyledKnowledgeBaseSlider
            name={fieldName}
            value={Number(sliderValue)}
            min={1}
            max={SLIDER_MAX_VALUES[fieldName]}
            step={1}
            onChange={(e, val) => setFieldValue(fieldName, val)}
          />
          <StyledTextField
            name={fieldName}
            width="66px"
            fontSize="15px"
            variant="standard"
            value={sliderValue}
            onChange={(e) => setFieldValue(fieldName, validateSliderChange(e.target.value, fieldName))}
          />
        </StyledFlex>
      </StyledFlex>
    );
  };

  const isUrlInvalid = errors.source?.url && touched.source?.url;

  return (
    <>
      <StyledFlex gap="12px">
        <InputLabel size={16} label="URL" mb={0} />
        <StyledFlex>
          <StyledTextField
            id="URL"
            name="url"
            placeholder="eg https://www.loremipsum.com"
            variant="standard"
            value={values.source.url}
            onChange={(e) => setFieldValue('source.url', e.target.value)}
            invalid={isUrlInvalid}
            onBlur={handleBlur}
          />
          {isUrlInvalid && <FormErrorMessage>{errors.source?.url}</FormErrorMessage>}
        </StyledFlex>
      </StyledFlex>
      <StyledDivider height="2px" m="15px 0px 15px 0px" />
      <StyledFlex gap="17px">
        <InputLabel size={16} label="Auto-Update Frequency" mb={0} />
        {renderSwitchAndLabel({
          fieldName: shouldAutoUpdateFrequency,
          labelSize: 16,
          labelWeight: 500,
          labelTitle: 'Auto-Update Source',
          setFn: setShouldAutoUpdateFrequency,
          tooltipTitle:
            'If toggled on, sources will be automatically updated every specified number of days in the below field',
        })}
      </StyledFlex>
      {shouldAutoUpdateFrequency &&
        renderSliderAndLabel({
          fieldName: SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY,
          labelTitle: 'Number of Days',
          sliderValue: values.autoUpdateFrequency,
        })}
      <StyledDivider height="2px" m="15px 0px 15px 0px" />
      <StyledFlex gap="17px">
        <InputLabel size={16} label="Website Crawler" mb={0} />
        {renderSwitchAndLabel({
          fieldName: shouldCrawlWebsite,
          labelSize: 16,
          labelWeight: 500,
          labelTitle: 'Crawl Website',
          setFn: setShouldCrawlWebsite,
          tooltipTitle:
            'If toggled on, website pages under the source URL path will be crawled and included in the source contents (with restrictions on the crawl depth and pages)',
        })}
        {shouldCrawlWebsite && (
          <StyledText size={14}>
            Depending on your configurations, it could take several minutes each time website is crawled. When the
            Knowledge Base is updating, it can still be used, but it will utilize the most recently crawled version of
            the website until the update is completed.
          </StyledText>
        )}
      </StyledFlex>
      {shouldCrawlWebsite && (
        <>
          {renderSliderAndLabel({
            fieldName: SLIDER_FIELD_NAMES.CRAWL_MAX_DEPTH,
            labelTitle: 'Crawl Max Depth',
            sliderValue: values.maxCrawlDepth,
            tooltipTitle:
              'Limits the max number of website pages between the source URL path and the deepest included page',
          })}
          {renderSliderAndLabel({
            fieldName: SLIDER_FIELD_NAMES.CRAWL_MAX_PAGES,
            labelTitle: 'Crawl Max Pages',
            sliderValue: values.maxCrawlPages,
            tooltipTitle: 'Limits the max number of website pages included within the source contents',
          })}
        </>
      )}
      {renderSwitchAndLabel({
        fieldName: SWITCH_FIELD_NAMES.CRAWL_ENCOUNTER_FILES,
        labelSize: 16,
        labelWeight: 500,
        labelTitle: 'Crawl Encountered PDF / Text Files',
        tooltipTitle: 'Crawl Encountered PDF / Text files',
      })}
    </>
  );
};

export default KnowledgeSourceFormWebsiteModal;
