import styled from '@emotion/styled';

export const StyledCalendarIsolationWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'hideTimeStamps',
})`
  position: relative;
  width: 100%;
  margin-top: 6px;
  border-left: 2px solid rgba(45, 58, 71, 0.25);
  height: ${({ hideTimeStamps }) => (hideTimeStamps ? 'calc(100% - 21px)' : 'auto')};

  .react-calendar__navigation__prev2-button {
    padding-left: 10px !important;
    padding-right: 10px !important;
    color: rgba(0, 0, 0, 0.25);
    font-size: 24px !important;
    display: flex !important;
    align-items: center !important;
  }

  .react-calendar__navigation__arrow {
    padding-left: 10px !important;
    padding-right: 10px !important;
    color: rgba(45, 58, 71, 1);
    font-size: 27px !important;
    display: flex !important;
    align-items: center !important;
  }

  .react-calendar__month-view__weekdays,
  .react-calendar,
  .react-calendar__month-view__days__day,
  .react-calendar__navigation__label > span {
    font-weight: 500 !important;
    font-size: 14.8px !important;
    font-family: 'Montserrat', sans-serif !important;
  }

  .react-calendar__month-view__weekdays__weekday {
    font-size: 12px !important;
    font-weight: 500 !important;
    font-family: 'Montserrat', sans-serif !important;
  }

  .react-calendar__navigation button {
    min-width: 5px !important;
  }

  .react-calendar__month-view__weekdays abbr {
    text-decoration: none !important;
  }

  .react-calendar__tile {
    padding: 0.75em !important;
    box-sizing: border-box;
  }

  .react-calendar__tile--now {
    background: transparent !important;
  }

  .react-calendar__tile--active {
    background: #f57b20 !important;

    box-sizing: border-box !important;
  }

  .react-calendar__tile:enabled {
    box-sizing: border-box !important;
    border: 1px solid transparent !important;
    overflow: hidden !important;
  }

  .react-calendar__tile:enabled:hover {
    background: white !important;
    border: 1px solid #f57b20 !important;
    cursor: pointer !important;
    color: #f57b20 !important;

    /* border-radius: 30px; */
  }

  .react-calendar__tile--rangeStart:enabled:hover {
    background: white !important;
    border: 1px solid #f57b20 !important;
    cursor: pointer !important;
    color: #f57b20 !important;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    /* border-radius: 30px; */
  }

  .react-calendar__tile--hoverEnd {
    background: white !important;
    border: 1px solid #f57b20 !important;
    cursor: pointer !important;
    color: #f57b20 !important;
    border-radius: 0 30px 30px 0;
    /* border-radius: 30px; */
  }

  .react-calendar__tile--hoverStart {
    background: white !important;
    border: 1px solid #f57b20 !important;
    cursor: pointer !important;
    color: #f57b20 !important;
    border-radius: 30px 0 0 30px;
    /* border-radius: 30px; */
  }

  .react-calendar__tile--rangeEnd:enabled:hover {
    background: white !important;
    border: 1px solid #f57b20 !important;
    cursor: pointer !important;
    color: #f57b20 !important;
    border-top-right-radius: 30px !important;
    border-bottom-right-radius: 30px !important;
    /* border-radius: 30px; */
  }

  .react-calendar__tile:enabled:focus {
    background: #f57b20 !important;
    cursor: pointer;
    color: white !important;
  }

  .react-calendar__navigation {
    border-bottom: 1px solid #a0a096 !important;
    box-sizing: border-box !important;
    display: flex;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: rgba(245, 123, 32, 0.2) !important;
  }

  .react-calendar__tile--range {
    background: rgba(245, 123, 32, 0.2) !important;
    color: #2d3a47 !important;
    border-radius: 0;
  }

  .react-calendar__tile--rangeStart {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;

    /* border-radius: 35px; */
    background: #f57b20 !important;
    color: white !important;
    transition: all 200ms ease !important;
  }

  .react-calendar__tile--rangeEnd {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;

    /* border-radius: 35px; */
    background: #f57b20 !important;
    color: white !important;
  }

  .react-calendar__tile:disabled {
    background-color: #f0f0f0 !important;
    line-height: 1.37em !important;
    background-color: #f0f0f0 !important;
    line-height: 1.37em !important;
    border-radius: 0 !important;
    border: none !important;
    cursor: not-allowed !important;
  }

  .react-calendar__tile:disabled:hover {
    background-color: #f0f0f0 !important;
    line-height: 1.37em !important;
    border-radius: 0 !important;
    border: none !important;
    color: rgba(16, 16, 16, 0.3) !important;
    cursor: not-allowed !important;
  }

  .react-calendar {
    width: 350px;
    max-width: 100%;
    background: white;
    border: 1px solid #a0a096;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
  }

  .react-calendar--doubleView {
    width: 700px;
  }

  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }

  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }

  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }

  .react-calendar button:enabled:hover {
    cursor: pointer;
  }

  .react-calendar__navigation {
    display: flex;
    height: 52px;
    margin-bottom: 1em;
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__navigation button[disabled] {
    background-color: #f0f0f0;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }

  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
    padding: calc(0.75em / 0.75) calc(0.5em / 0.75);
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }

  .react-calendar__tile {
    max-width: 100%;
    text-align: center;
    padding: 0.75em 0.5em;
    background: none;
  }

  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--now {
    background: #ffff76;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffffa9;
  }

  .react-calendar__tile--hasActive {
    background: #76baff;
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }

  .react-calendar__tile--active {
    background: #006edc;
    color: white;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1087ff;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--rangeStart:enabled:hover {
    background: #2d3a47 !important;
    border-color: #2d3a47 !important;
    color: #ffffff !important;
  }
`;
