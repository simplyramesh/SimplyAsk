import styled from '@emotion/styled';

export const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  & .react-calendar {
    all: unset;

    max-width: 100% !important;

    background: ${({ theme }) => theme.colors.white} !important;

    font-family: 'Montserrat' !important;
    font-style: normal !important;
    border: none !important;
    width: initial;
  }

  & .react-calendar__month-view__weekdays {
    text-align: center;
    font-family: 'Montserrat' !important;
    font-style: normal;

    &__weekday {
      color: ${({ theme }) => theme.colors.primary};
      font-size: 12px !important;
      line-height: 12px !important;
      letter-spacing: 0.03em !important;
      text-transform: uppercase !important;
      font-weight: 700 !important;
    }
  }

  & .react-calendar,
  & .react-calendar *,
  & .react-calendar *:before,
  & .react-calendar *:after {
    box-sizing: border-box;

    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  & div.react-calendar__viewContainer > div > div {
    flex: 1 1 auto;
  }

  & .react-calendar button {
    font-size: 16px !important;
    line-height: 22px !important;
    font-weight: 500 !important;
    text-align: center !important;
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  & .react-calendar button:enabled:hover {
    cursor: pointer;
  }

  & .react-calendar__navigation {
    display: flex;

    height: 60px;

    border-top: ${({ theme }) => `1.5px solid ${theme.colors.borderNoError}`};
    border-bottom: ${({ theme }) => `1.5px solid ${theme.colors.borderNoError}`};

    color: ${({ theme }) => theme.colors.primary};

    margin-bottom: 18px;
  }

  & .react-calendar__navigation > button.react-calendar__navigation__label > span {
    font-size: 18px !important;
    line-height: 22px !important;
    font-family: 'Montserrat' !important;
    font-weight: 600 !important;
    font-style: normal !important;
    color: ${({ theme }) => theme.colors.primary} !important;

    opacity: 1;
  }

  & .react-calendar__navigation > button.react-calendar__navigation__label,
  & .react-calendar__navigation > button:disabled.react-calendar__navigation__label {
    opacity: 1;
    padding: 0;
  }

  & .react-calendar__navigation > button.react-calendar__navigation__arrow {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    font-size: 32px !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  & .react-calendar__navigation button {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    border: none !important;
    outline: none !important;

    background: transparent !important;
  }

  & .react-calendar__navigation button:disabled {
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.4;
  }

  & .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr);

    & .react-calendar__tile {
      max-width: initial;

      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      outline: none;
      padding: 0 !important;
      margin-bottom: 12px;

      &:disabled {
        opacity: 0.4;
        background-color: transparent !important;
        pointer-events: none;
      }

      abbr {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 24px;
        height: 24px;
        padding: 18px;

        border-radius: 100px;

        font-weight: 500;
        text-decoration: none;
      }

      &:hover {
        border: none !important;
        border-radius: 100px;

        abbr {
          background-color: ${({ theme }) => theme.colors.secondary};
          color: ${({ theme }) => theme.colors.white};
        }
      }
    }

    & .react-calendar__tile--active.react-calendar__tile--range {
      background-color: rgba(245, 123, 32, 0.3);
    }

    & .react-calendar__tile--range {
      color: ${({ theme }) => theme.colors.primary} !important;

      &:hover {
        background-color: rgba(245, 123, 32, 0.3) !important;
        border-radius: 0;

        abbr {
          background-color: ${({ theme }) => theme.colors.secondary} !important;
          color: ${({ theme }) => theme.colors.white} !important;
        }
      }
    }

    & .react-calendar__tile--rangeStart {
      border-radius: 100px 0 0 100px !important;
      background-color: rgba(245, 123, 32, 0.3) !important;
      margin-left: 12% !important;

      &:hover {
        background-color: rgba(245, 123, 32, 0.3) !important;
        border-radius: 100px 0 0 100px !important;
      }

      abbr {
        background-color: ${({ theme }) => theme.colors.secondary} !important;
        color: ${({ theme }) => theme.colors.white} !important;
        border-radius: 100px !important;
        margin-left: -12% !important;
      }
    }

    & .react-calendar__tile--rangeEnd {
      border-radius: 0 100px 100px 0 !important;
      margin-right: 12% !important;

      &:hover {
        background-color: rgba(245, 123, 32, 0.3) !important;
        border-radius: 0 100px 100px 0 !important;
      }

      abbr {
        background-color: ${({ theme }) => theme.colors.secondary} !important;
        color: ${({ theme }) => theme.colors.white} !important;
        border-radius: 100px !important;
        margin-right: -14% !important;
      }
    }

    & .react-calendar__tile--active.react-calendar__tile--rangeBothEnds {
      background-color: transparent !important;
    }
  }

  & .react-calendar__month-view__weekdays {
    display: grid !important;
    flex: 1 1 auto;
    grid-template-columns: repeat(7, 1fr);

    font-size: 12px;
    line-height: 12px;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: 0.03em;

    margin-bottom: 24px;
  }

  & div.react-calendar__month-view__weekdays__weekday > abbr[title] {
    text-decoration: none;
  }

  & .react-calendar__month-view__days__day--weekend {
    color: ${({ theme }) => theme.colors.primary};
  }

  & .calendar__saturday {
    border-radius: 0 100px 100px 0 !important;

    &:hover {
      margin-right: 12% !important;

      abbr {
        margin-right: -14% !important;
      }
    }
  }

  & .calendar__sunday {
    border-radius: 100px 0 0 100px !important;

    &:hover {
      margin-left: 12% !important;

      abbr {
        margin-left: -14% !important;
      }
    }
  }

  & .react-calendar__tile--rangeStart.calendar__saturday {
    border-radius: 50% !important;
    margin-right: 14% !important;
    background-color: rgba(245, 123, 32, 0.3) !important;

    abbr {
      margin-right: -14% !important;
    }

    &:hover {
      border-radius: 50% !important;
      margin-right: 14% !important;
      background-color: rgba(245, 123, 32, 0.3) !important;

      abbr {
        margin-right: -14% !important;
      }
    }
  }

  & .react-calendar__tile--rangeEnd.calendar__sunday {
    border-radius: 50% !important;
    margin-left: 14% !important;
    background-color: rgba(245, 123, 32, 0.3) !important;

    abbr {
      margin-left: -14% !important;
    }

    &:hover {
      border-radius: 50% !important;
      margin-left: 14% !important;
      background-color: rgba(245, 123, 32, 0.3) !important;

      abbr {
        margin-left: -14% !important;
      }
    }
  }

  & .react-calendar__month-view__days__day--neighboringMonth {
    abbr {
      color: rgba(45, 58, 71, 0.4) !important;
    }

    &:hover {
      abbr {
        color: ${({ theme }) => theme.colors.white} !important;
      }
    }
  }

  & .react-calendar__tile:enabled:hover,
  & .react-calendar__tile:enabled:focus {
  }
`;
