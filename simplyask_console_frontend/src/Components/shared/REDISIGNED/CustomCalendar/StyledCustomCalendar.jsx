import styled from '@emotion/styled';
import { Stack } from '@mui/material';

export const StyledCalendarWrapper = styled(Stack, {
  shouldForwardProp: (prop) => !['bgColor', 'textColor'].includes(prop),
})`
  font-style: normal !important;

  & .react-calendar__navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-top: ${({ theme }) => `1.5px solid ${theme.colors.inputBorder}`};
    border-bottom: ${({ theme }) => `1.5px solid ${theme.colors.inputBorder}`};
    padding: 9px 0;
    margin-bottom: 19px;

    &__arrow {
      font-size: 32px;
      text-align: center;
      vertical-align: middle;
      color: ${({ theme, textColor }) => textColor || theme.colors.primary};
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 0;

      &:disabled {
        opacity: 0.4;
        pointer-events: none;
      }
    }

    &__prev2-button {
      margin-right: 2px;
    }

    &__next2-button {
      margin-left: 2px;
    }

    &__label {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: ${({ theme, textColor }) => textColor || theme.colors.primary};
      background-color: transparent;
      border: none;
      outline: none;
    }
  }

  & .react-calendar__month-view__weekdays {
    font-size: 12px;
    line-height: 12px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 18px;

    abbr {
      text-decoration: none;
    }
  }

  & .react-calendar__month-view__days {
    gap: 13px 0px;

    &__day--neighboringMonth {
      opacity: 0.4;

      &.react-calendar__tile--active,
      &.react-calendar__tile--range {
        opacity: 1;
      }

      &:hover {
        opacity: 1;
      }
    }

    & button.react-calendar__tile {
      cursor: pointer;
      background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
      padding: 1px 0;

      & div {
        position: relative;
        z-index: 2;
        flex: 1 1 35px;
        align-items: center;
        justify-content: center;
        color: ${({ theme, textColor }) => textColor || theme.colors.primary};
        pointer-events: none;

        p {
          position: relative;

          z-index: 2;
          color: ${({ theme }) => theme.colors.primary};
          background-color: ${({ theme }) => theme.colors.white};
          border-radius: 50%;
          width: 35px;
          height: 35px;
          align-items: center;
          justify-content: center;
          transition: ${({ theme }) => `background-color ${theme.transitions.default}`};
        }
      }

      &:disabled {
        opacity: 0.4;
        background-color: transparent !important;
        pointer-events: none;
      }

      &--active,
      &--range {
        color: ${({ theme, textColor }) => textColor || theme.colors.primary};

        & div {
          background-color: ${({ theme }) => theme.colors.tertiary};

          p {
            color: ${({ theme, textColor }) => textColor || theme.colors.primary};
            background-color: ${({ theme }) => theme.colors.tertiary};
          }
        }

        &.custom-calendar__month-view__days__day--saturday {
          & div {
            background-color: ${({ theme }) => theme.colors.white};
          }

          & div::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 75%;
            z-index: 1;
            background-color: ${({ theme }) => theme.colors.tertiary};
            border-radius: 0 50px 50px 0;
          }
        }

        &.custom-calendar__month-view__days__day--sunday {
          & div {
            background-color: ${({ theme }) => theme.colors.white};
          }

          & div::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 75%;
            z-index: 1;
            background-color: ${({ theme }) => theme.colors.tertiary};
            border-radius: 50px 0 0 50px;
          }
        }
      }

      &--rangeBothEnds {
        & div {
          background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
        }

        & div::before,
        & div::after {
          display: none;
        }
      }

      &--rangeStart,
      &--rangeEnd {
        & div p {
          background-color: ${({ theme }) => theme.colors.secondary};
          color: ${({ theme }) => theme.colors.white};
        }
      }

      &--rangeStart {
        & div {
          background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
        }

        & div::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 75%;
          z-index: 1;
          background-color: ${({ theme }) => theme.colors.tertiary};
          border-radius: 50px 0 0 50px;
        }

        &.custom-calendar__month-view__days__day--saturday {
          & div::before,
          & div::after {
            display: none;
          }
        }

        &.custom-calendar__month-view__days__day--sunday {
          & div::before {
            display: none;
          }
        }
      }

      &--rangeEnd {
        & div {
          background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
        }

        & div::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 75%;
          z-index: 1;
          background-color: ${({ theme }) => theme.colors.tertiary};
          border-radius: 0 50px 50px 0;
        }

        &.custom-calendar__month-view__days__day--sunday {
          & div::after,
          & div::before {
            display: none;
          }
        }
      }

      &:hover {
        & div p {
          background-color: ${({ theme }) => theme.colors.secondary};
          color: ${({ theme, textColor }) => textColor || theme.colors.primary};
        }
      }
    }

    & button.react-calendar__month-view__days__day {
      display: flex;
      align-items: center;
      justify-content: center;

      border: none;
      outline: none;
    }

    abbr {
      display: none;
    }
  }
`;
