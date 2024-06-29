import { useTheme } from '@emotion/react';
import { Popover } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

import FallbackImage from '../../../Assets/images/whatIsRoboticProcess.png';
import { getAllInsights } from '../../../Services/axios/mySummaryAxios';
import NoDataFound, { NO_DATA_MY_SUMMARY_TEXTS } from '../../shared/NoDataFound/NoDataFound';
import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import {
  StyledCarousel,
  StyledCarouselAutoplayIndication,
  StyledCarouselHandler,
  StyledCarouselImg,
  StyledCarouselImgHolder,
  StyledCarouselInfo,
  StyledCarouselItem,
  StyledDropdownContent,
  StyledDropdownItem,
  StyledInsightsHeaderCarousel,
  StyledInsightsSection,
  StyledInsightsTag,
  StyledInsightsTags,
} from './StyledSimplyAskInsights';

// eslint-disable-next-line no-unused-vars

const AUTO_PLAY_TIME = 15;
const AUTO_PLAY_STATUS = {
  IDLE: 0,
  RUNNING: 1,
  PAUSED: 2,
  RESUMED: 3,
  STOPPED: 4,
};

let autoPlayIntervalFn;
let autoPlayTimeOutFn;
let autoplayTimeStart;
let autoplayTimeResume;

const SimplyAskInsights = () => {
  const { colors } = useTheme();

  const [open, setOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(1);
  const [autoPlay, setAutoPlay] = useState(AUTO_PLAY_STATUS.IDLE);
  const [isCarouselOnFocus, setIsCarouselOnFocus] = useState(false);

  const anchorRef = useRef(null);

  const { data: insights } = useQuery({
    queryKey: ['insights'],
    queryFn: getAllInsights,
    select: (data) => data?.content,
  });

  useEffect(() => {
    setTimeout(() => {
      setDataLoading(false);
    }, 1500);
    return () => carouselAutoplay('stop');
  }, []);

  // eslint-disable-next-line no-unused-vars
  const carouselAutoplay = (action) => {
    switch (action) {
      case 'run':
        setAutoPlay(AUTO_PLAY_STATUS.RUNNING);
        autoplayTimeStart = new Date();

        autoPlayIntervalFn = setInterval(() => {
          autoplayTimeStart = new Date().getTime();
          autoplayTimeResume = undefined;
          nextSlide();
        }, 1000 * AUTO_PLAY_TIME);
        break;
      case 'pause':
        clearTimeout(autoPlayTimeOutFn);
        clearInterval(autoPlayIntervalFn);

        setAutoPlay(AUTO_PLAY_STATUS.PAUSED);

        if (!autoplayTimeResume) {
          autoplayTimeResume = AUTO_PLAY_TIME * 1000 - (new Date().getTime() - autoplayTimeStart);
        } else {
          autoplayTimeResume -= new Date().getTime() - autoplayTimeStart;
        }

        break;
      case 'resume':
        setAutoPlay(AUTO_PLAY_STATUS.RESUMED);

        autoplayTimeStart = new Date().getTime();
        autoPlayTimeOutFn = setTimeout(() => {
          nextSlide();
          carouselAutoplay('run');
        }, autoplayTimeResume);
        break;
      case 'stop':
        clearTimeout(autoPlayTimeOutFn);
        clearInterval(autoPlayIntervalFn);

        setAutoPlay(AUTO_PLAY_STATUS.STOPPED);
        break;
      default:
        console.error('Wrong carousel action');
    }
  };

  useEffect(() => {
    if (!dataLoading && insights?.length && autoPlay !== AUTO_PLAY_STATUS.STOPPED) {
      if (!isCarouselOnFocus && autoPlay === AUTO_PLAY_STATUS.IDLE) {
        carouselAutoplay('run');
      }

      if (!isCarouselOnFocus && autoPlay === AUTO_PLAY_STATUS.PAUSED) {
        carouselAutoplay('resume');
      }

      if (isCarouselOnFocus) {
        carouselAutoplay('pause');
      }
    }
  }, [dataLoading, insights, isCarouselOnFocus]);

  const showAllInsights = (clickFromDropDown) => {
    if (clickFromDropDown) {
      setOpen(false);
    }
    window.open('https://symphona.ai/blog/');
  };

  const goToInsight = (item) => {
    window.open(item.readMoreLink);
  };

  const prevSlide = (manually) => {
    setSlideIndex(slideIndex > 1 ? slideIndex - 1 : insights?.length);

    if (manually && autoPlay !== AUTO_PLAY_STATUS.STOPPED) {
      carouselAutoplay('stop');
    }
  };
  const nextSlide = (manually) => {
    setSlideIndex((prevIndex) => (prevIndex < insights?.length ? prevIndex + 1 : 1));

    if (manually && autoPlay !== AUTO_PLAY_STATUS.STOPPED) {
      carouselAutoplay('stop');
    }
  };

  const addDefaultSrc = (e) => {
    e.target.src = FallbackImage;
  };

  const insightsCarousel = () => {
    return (
      <StyledCarousel onMouseEnter={() => setIsCarouselOnFocus(true)} onMouseLeave={() => setIsCarouselOnFocus(false)}>
        {insights.map((item) => {
          return (
            <StyledCarouselItem key={item?.id} shown={slideIndex} onClick={() => goToInsight(item)}>
              <StyledCarouselImgHolder isHover={isCarouselOnFocus}>
                <StyledCarouselImg
                  type="image"
                  src={item?.imgLink}
                  onError={addDefaultSrc}
                  alt="Symphona Insights image"
                />
                <StyledCarouselAutoplayIndication
                  autoplay={autoPlay === AUTO_PLAY_STATUS.RUNNING || autoPlay === AUTO_PLAY_STATUS.RESUMED}
                  duration={AUTO_PLAY_TIME}
                />
              </StyledCarouselImgHolder>

              {!!item?.tags && !!item?.tags?.length && (
                <StyledInsightsTags>
                  {item?.tags.map((tag) => (
                    <StyledInsightsTag key={tag}>{tag}</StyledInsightsTag>
                  ))}
                </StyledInsightsTags>
              )}

              <StyledFlex height="96px">
                <StyledText weight={600} maxLines={2} lh={24} color={isCarouselOnFocus && colors.secondary}>
                  {item?.headline}
                </StyledText>
                <StyledText maxLines={2} lh={24}>
                  {item?.description}
                </StyledText>
              </StyledFlex>
            </StyledCarouselItem>
          );
        })}
      </StyledCarousel>
    );
  };

  return (
    <StyledInsightsSection>
      <StyledInsightsHeaderCarousel>
        <StyledText size={19} lh={23} weight={600}>
          Symphona Insights
        </StyledText>

        {!!insights && !!insights?.length && (
          <StyledCarouselHandler>
            <CustomTableIcons
              icon="ARROW_LEFT"
              width={22}
              bgColorHover={colors.tableEditableCellBg}
              radius="5px"
              onClick={() => prevSlide(true)}
            />

            <StyledCarouselInfo>
              {slideIndex}
              <span>/</span>
              {insights?.length}
            </StyledCarouselInfo>

            <CustomTableIcons
              icon="ARROW_RIGHT"
              width={22}
              radius="5px"
              bgColorHover={colors.tableEditableCellBg}
              onClick={() => nextSlide(true)}
            />
          </StyledCarouselHandler>
        )}

        {!dataLoading && (
          <CustomTableIcons
            icon="MORE_VERT"
            width={16}
            height={22}
            onClick={() => setOpen(true)}
            bgColorHover={colors.tableEditableCellBg}
            radius="5px"
            ref={anchorRef}
          />
        )}

        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={anchorRef.current}
        >
          <StyledDropdownContent onClick={() => showAllInsights(true)}>
            <StyledDropdownItem>
              <CustomTableIcons icon="OPEN_IN_NEW" width={16} />
              <span>Open All Insights</span>
            </StyledDropdownItem>
          </StyledDropdownContent>
        </Popover>
      </StyledInsightsHeaderCarousel>

      {dataLoading && <Spinner medium />}
      {!dataLoading &&
        (insights && !!insights?.length ? (
          insightsCarousel()
        ) : (
          <NoDataFound
            title={NO_DATA_MY_SUMMARY_TEXTS.NO_DATA_SIMPLYASK_INSIGHTS.title}
            link="View All Past Insights"
            handleClickLink={showAllInsights}
            customStyle={{
              minHeight: '200px',
              iconName: 'insights',
              iconSize: '60px',
              titleFontSize: 'inherit',
            }}
          />
        ))}
    </StyledInsightsSection>
  );
};

export default SimplyAskInsights;
