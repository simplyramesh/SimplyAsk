/* eslint-disable max-len */
import { useTheme } from '@emotion/react';
import { SvgIcon } from '@mui/material';

const StandingPeopleIcon = ({ accentColour, ...props }) => {
  const { colors } = useTheme();

  const newAccentColor = accentColour || colors.symphonaBlue;

  return (
    <SvgIcon {...props}>
      <path fill="#fff" d="M3.98 3.67h16v16.61h-16z" />
      <path
        fill="#3f3d56"
        d="M19.95 3.87v6.2l-.05-.05a6.79 6.79 0 0 0-5.93-1.95 5.2 5.2 0 0 0-1.93.6c-3.26 2.2-6.95.11-7.98-.47A2.16 2.16 0 0 1 4 8.16v-4.3a.2.2 0 0 1 .2-.19h15.56a.2.2 0 0 1 .2.2z"
      />
      <path
        fill="#ffb6b6"
        d="m12.07 13.19-.42.1c-.04.27-.03 1.4-.03 1.4l-.04 1.07a.19.19 0 0 0 .05.26.2.2 0 0 0 .26-.04.19.19 0 0 0 .02-.2l.05-1.32z"
      />
      <path
        fill={newAccentColor}
        d="M11.59 12.1a.45.45 0 0 1 .5.25c.03.06.05.12.05.2v.26s.11 1.39.01 1.66l-.13.78-.45.06-.02-.83s.13-.9-.01-1.05a2.33 2.33 0 0 1-.3-.78.46.46 0 0 1 .06-.35.45.45 0 0 1 .29-.2z"
      />
      <path
        fill="#e6e6e6"
        d="m8.46 19.45-.01-.01-.64-4.6-1.28 4.6-.01.01h-.01v-.02l1.3-4.63h.02l.65 4.63v.01h-.01v.01z"
      />
      <path fill="#e6e6e6" d="m7.54 19.45-.01-.01.27-4.63v-.01h.02v.01l-.26 4.63-.02.01z" />
      <path
        fill="#e6e6e6"
        d="M9.9 13.92a.2.2 0 0 1-.09.22.23.23 0 0 1-.03.02l-2.87 1.18a.2.2 0 0 1-.15-.37l2.87-1.19a.2.2 0 0 1 .23.07.2.2 0 0 1 .04.07z"
      />
      <path
        fill="#e6e6e6"
        d="M6.95 14.58h.07c.02 0 .03.04.03.06l.06.22v.07a.08.08 0 0 1-.16-.02l-.06-.23v-.06a.09.09 0 0 1 .06-.04z"
      />
      <path fill="#e6e6e6" d="m6.78 14.59.33-.08h.04l.02.04v.04l-.04.02-.32.08h-.05l-.01-.02-.01-.01v-.05l.04-.02z" />
      <path fill="#ccc" d="M6.65 15.24a.2.2 0 0 1 .04-.23.26.26 0 0 1 .25.31.2.2 0 0 1-.29-.08z" />
      <path
        fill="#e6e6e6"
        d="M11.35 19.7c0-.03-.12-.05-.27-.06-.14 0-.26.01-.26.03 0 .02.11.05.26.05.15 0 .27 0 .27-.03z"
      />
      <path
        fill="#3f3d56"
        d="M13.02 19.85c0-.02-.12-.05-.26-.05-.15 0-.27 0-.27.03 0 .02.12.04.27.05.14 0 .26 0 .26-.03z"
      />
      <path
        fill="#ff6584"
        d="M10.67 19.95c0-.02-.12-.04-.26-.05-.15 0-.27.01-.27.03 0 .03.12.05.26.05.15.01.27 0 .27-.03zm1.8.25c0-.02-.11-.04-.26-.04-.14-.01-.26 0-.26.03 0 .02.11.04.26.05.14 0 .26-.01.26-.03z"
      />
      <path
        fill="#e6e6e6"
        d="M9.84 20.02c0-.03-.05-.04-.11-.04-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .11-.01.11-.03zm.66.14c0-.02-.06-.03-.12-.03-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .11-.02.11-.04z"
      />
      <path
        fill="#3f3d56"
        d="M9.43 20.22c0-.02-.05-.04-.12-.04-.06 0-.11.02-.11.04s.05.04.11.04c.07 0 .12-.02.12-.04z"
      />
      <path
        fill="#e6e6e6"
        d="M11.67 19.96c0-.01-.06-.03-.12-.03-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .12-.01.12-.03z"
      />
      <path
        fill="#ff6584"
        d="M10.9 19.82c0-.02-.05-.04-.11-.04-.07 0-.12.02-.12.04s.05.03.12.03c.06 0 .12-.01.12-.03z"
      />
      <path
        fill="#3f3d56"
        d="M12.17 19.74c0-.02-.05-.04-.12-.04-.06 0-.12.02-.12.04s.06.03.12.03c.07 0 .12-.01.12-.03zm-.96.43c0-.02-.05-.04-.12-.04-.06 0-.11.02-.12.04 0 .02.06.04.12.04.07 0 .12-.02.12-.04z"
      />
      <path
        fill="#222223"
        d="M19.75 3.67H4.2a.2.2 0 0 0-.2.2v16.25a.2.2 0 0 0 .2.2h15.56a.2.2 0 0 0 .2-.2V3.87a.2.2 0 0 0-.2-.2zm.14 16.45a.14.14 0 0 1-.14.14H4.2a.14.14 0 0 1-.14-.14V3.87a.14.14 0 0 1 .14-.14h15.55a.14.14 0 0 1 .14.14zM14.82 3.7a1.74 1.74 0 0 0-.05-.03h-1.64a1.6 1.6 0 0 0-.03.06h1.76l-.04-.03zM4 9.23v.41h.02l-.01.8v1.58h.05V9.04L4 9.22zM14.82 3.7a1.74 1.74 0 0 0-.05-.03h-1.64a1.6 1.6 0 0 0-.03.06h1.76l-.04-.03z"
      />
      <path
        fill={newAccentColor}
        d="M17.8 5.32a.28.28 0 1 0 0-.56.28.28 0 0 0 0 .56zm-3.58.95a.06.06 0 1 0 0-.11.06.06 0 0 0 0 .1zm-2.85 1.09a.06.06 0 1 0 0-.11.06.06 0 0 0 0 .11z"
      />
      <path fill="#ff6584" d="M8.2 5.93a.06.06 0 1 0 0-.1.06.06 0 0 0 0 .1z" />
      <path
        fill="#fff"
        d="M9.55 4.53a.06.06 0 1 0 0-.1.06.06 0 0 0 0 .1zm9.35-.3a.06.06 0 1 0 0-.12.06.06 0 0 0 0 .12zm-2.88.95a.06.06 0 1 0 0-.11.06.06 0 0 0 0 .1zm3.3.92a.06.06 0 1 0 0-.11.06.06 0 0 0 0 .11zm-9.82.92a.06.06 0 1 0 0-.1.06.06 0 0 0 0 .1z"
      />
      <path fill="#ff6584" d="M5.21 6.86a.06.06 0 1 0 0-.12.06.06 0 0 0 0 .12z" />
      <path
        fill="#fff"
        d="M7.31 7.45h-.05l-.01.05-.02-.05h-.05l.04-.03-.02-.04.04.02.04-.03-.01.05zm6.75-2.97H14v.06l-.03-.05h-.05l.04-.03-.02-.05.04.03.04-.04v.05zm3.19 2.27h-.06v.05l-.03-.05-.05.01.04-.04-.02-.04.04.02.04-.03v.05zm-5.94-.65h-.05l-.01.06-.02-.05h-.05l.04-.03-.02-.05.04.03.04-.03-.01.05zM8.83 8.6h-.06v.05l-.03-.05h-.05l.04-.03-.02-.05.04.03.04-.03-.01.05zm10.54-.06h-.05l-.01.05-.02-.04h-.05l.04-.03-.02-.05.04.02.04-.03-.01.05zM5.83 5.3h-.05l-.01.05-.02-.05h-.06l.04-.03-.02-.05.05.03.04-.04-.01.06z"
      />
      <path
        fill="#a0616a"
        d="m11.99 13.73.1-1.41a.23.23 0 0 1 .32-.2.23.23 0 0 1 .13.24l-.14 1.47-.05.89a.2.2 0 1 1-.25.06z"
      />
      <path
        fill="#dadada"
        d="M11.97 12.63a.07.07 0 0 1 0-.08.09.09 0 0 0 0-.06v-.06l.03-.06a.42.42 0 0 0 .08-.2 1 1 0 0 1 .06-.24c.04-.1.15-.2.28-.14.06.02.1.06.13.11.07.11.06.25.06.37l.03-.05c-.01.14 0 .28.05.4-.03 0-.05.04-.04.07.01.03.03.05.06.07.03.02.05.06.02.1l-.02.02-.04.01c-.21.02-.43 0-.64-.07-.04-.01-.09-.03-.11-.08-.02-.04 0-.1.05-.1z"
      />
      <path fill="#a0616a" d="M13.86 19.85h.25l.12-.96h-.37z" />
      <path
        fill="#2f2e41"
        d="m13.78 19.68.4-.02v.17l.37.26a.1.1 0 0 1 .04.12.1.1 0 0 1-.1.08h-.47l-.08-.17-.04.17h-.18z"
      />
      <path fill="#a0616a" d="m12.52 19.63.23.1.46-.86-.34-.13z" />
      <path
        fill="#2f2e41"
        d="m12.5 19.44.38.13-.06.16.26.38a.1.1 0 0 1-.13.16l-.44-.18-.02-.18-.09.14-.16-.06zm.17-5.81h1.17l.44 3.14s-.25.1-.14.2l.11.12c.1.09-.06.4-.06.4l.18 1.84h-.75l-.36-3.8.5 1.82-.65 1.98-.46-.27-.1-.25.19-.18s.05-.27.05-.43c0-.16-.14-.03 0-.16.05-.06.22-.78.22-.78l-.54-1.73-.13-.77c-.03-.2 0-.4.09-.59l.24-.54z"
      />
      <path
        fill="#dadada"
        d="m12.6 11.71.08-.23a.27.27 0 0 1 .24-.19H13a.27.27 0 0 1 .28.19.27.27 0 0 0 .24.2c.2 0 .5.07.5.28 0 .32-.34 1.15-.28 1.22.07.07.23.35.14.43-.02.02 0 .12 0 .2.02.13-.93-.16-1.2-.09-.27.08-.13-.5-.18-.54-.04-.05-.08-.1-.11-.17a.27.27 0 0 1-.04-.08l-.07-.4v-.02c-.02-.08-.08-.65.15-.73l.18-.07z"
      />
      <path
        fill="#a0616a"
        d="m13.66 13.8-.04-1.43a.23.23 0 0 1 .22-.23.23.23 0 0 1 .24.23v1.48l.03.9a.2.2 0 0 1-.01.37.2.2 0 0 1-.24-.3z"
      />
      <path
        fill="#dadada"
        d="M13.5 12.67a.07.07 0 0 1-.02-.08l.01-.06c0-.03-.01-.05 0-.07 0-.02 0-.04.02-.06a.42.42 0 0 0 .06-.21l.03-.24c.04-.1.13-.2.27-.17a.3.3 0 0 1 .15.1c.07.11.08.24.08.37l.03-.06c0 .14.03.28.09.4-.03 0-.05.04-.04.07.02.02.04.05.07.06.03.03.06.06.03.1l-.02.03a1.57 1.57 0 0 1-.68 0c-.05-.02-.1-.03-.12-.07-.03-.04-.01-.11.04-.11z"
      />
      <path fill="#a0616a" d="M12.92 11.33a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path
        fill="#2f2e41"
        d="M12.45 11.58c0-.05.07-.08.13-.07.05.02.1.07.14.1.04.04.1.07.16.05.05-.02.07-.08.1-.12a.28.28 0 0 1 .17-.07v-.11a.28.28 0 0 0 .09.1h.18c.08-.03.15-.1.14-.17a.18.18 0 0 0-.1-.13c-.05-.03.13-.15.07-.18a.4.4 0 0 1-.2-.23.3.3 0 0 1 .03-.27c.05 0-.13.02-.09 0 0-.03 0 .02 0 0 0 .02.03-.04.05-.02a.18.18 0 0 0 .08-.09c.03-.09-.02-.1-.1-.16a.45.45 0 0 0-.7.18c-.1-.05-.25 0-.32.1-.08.1-.1.22-.1.34 0 .28.1.54.27.75z"
      />
      <path fill="#ffb6b6" d="M10.64 20.06h-.23l-.11-.9h.34z" />
      <path fill="#2f2e41" d="M10.65 20.3h-.72a.28.28 0 0 1 .28-.28l.13-.1.25.1h.06z" />
      <path fill="#ffb6b6" d="M11.7 20.06h-.23l-.11-.9h.34z" />
      <path
        fill="#2f2e41"
        d="M11.7 20.3H11a.28.28 0 0 1 .27-.28l.13-.1.25.1h.06zm-1.63-6s-.37.46-.3.58c.07.12.2.08.07.21-.11.13-.16.13-.08.22.08.1.16 2.14.16 2.14l.37 2.12.41.04s.08-.26.08-.36v-.23c0-.2-.07-.04 0-.24.08-.2.17-.78 0-1.07-.16-.28-.03-.03-.03-.03l.12-1.93.24 1.98s0 .69.12 1.18l.02.7.5-.02s.14-.21.1-.44c-.05-.24.14-.36.14-.48l-.01-1.24-.11-2.34s.1-.53-.12-.74c-.21-.22-1.67-.05-1.67-.05z"
      />
      <path
        fill={newAccentColor}
        d="m10.53 11.81.32-.36.51.05.33.46c.37.09.43.38.37.75-.13.74-.44 1.25-.3 1.61.22.55.11.97-.4.9-.53-.08-1.73-.59-1.39-.93.34-.33.24-.77.24-.77l.03-1.03c-.06-.33-.05-.64.29-.68z"
      />
      <path
        fill="#ffb6b6"
        d="m10.37 13.07-.36-.24c-.23.16-1.03.96-1.03.96l-.8.72a.2.2 0 0 0-.14.12.2.2 0 0 0 .36.13l.98-.88z"
      />
      <path
        fill={newAccentColor}
        d="M10.8 11.96a.45.45 0 0 1 .08.7l-.2.2s-.9 1.04-1.17 1.16l-.65.45-.36-.28.58-.6s.74-.53.74-.74c0-.12.17-.48.35-.76a.45.45 0 0 1 .63-.13z"
      />
      <path fill="#ffb6b6" d="M11.7 10.97a.53.53 0 1 0-1-.36.53.53 0 0 0 1 .36z" />
      <path
        fill="#2f2e41"
        d="M10.93 10.19a.3.3 0 0 1 .08-.1.15.15 0 0 1 .21.07c0-.03 0-.05.02-.08a.4.4 0 0 0 .1.08l-.05-.12c.2-.02.36.04.43.2.01.04.09.04.1.08.03.05 0 .13-.04.13.09 0 .06.08.09.17.03.1.01.2-.02.3-.04.13-.15.22-.26.28l-.22.11c-.4.21-.65-.21-.56-.63.02-.1.1-.2.05-.27-.05-.06-.13-.05-.2-.03.03-.1.21-.11.27-.2z"
      />
      <path
        fill="#e6e6e6"
        d="M17.6 19.73c0-.02-.14-.05-.3-.05-.16 0-.29 0-.29.03 0 .02.13.04.3.05.15 0 .28 0 .28-.03z"
      />
      <path
        fill="#3f3d56"
        d="M19.43 19.9c0-.03-.13-.05-.3-.06-.15 0-.28 0-.28.03 0 .02.13.04.29.05.16 0 .29 0 .29-.03z"
      />
      <path
        fill="#ff6584"
        d="M16.85 19.99c0-.03-.13-.05-.29-.05-.16-.01-.29 0-.29.02 0 .03.13.05.29.06.16 0 .29-.01.3-.03zm1.98.26c0-.03-.13-.05-.29-.06-.16 0-.29.01-.29.03 0 .03.13.05.29.05.16.01.29 0 .29-.02z"
      />
      <path
        fill="#e6e6e6"
        d="M15.95 20.05c0-.03-.06-.04-.13-.04s-.13.01-.13.03c0 .02.06.04.13.04s.13-.01.13-.03zm.71.15c0-.02-.06-.04-.13-.04s-.13.01-.13.03c0 .02.06.04.13.04s.13-.01.13-.03z"
      />
      <path fill="#3f3d56" d="M15.5 20.25c0-.02-.06-.04-.13-.04s-.13.02-.13.04.06.03.13.04c.07 0 .13-.02.13-.04z" />
      <path fill="#e6e6e6" d="M17.94 20c0-.02-.05-.03-.12-.04-.08 0-.13.02-.13.04s.05.04.12.04c.08 0 .13-.02.13-.04z" />
      <path fill="#ff6584" d="M17.11 19.85c0-.02-.06-.03-.13-.03s-.13.01-.13.03c0 .02.06.04.13.04s.13-.02.13-.04z" />
      <path
        fill="#3f3d56"
        d="M18.5 19.78c0-.02-.06-.04-.14-.04-.07 0-.12.01-.12.03 0 .02.05.04.12.04.08 0 .13-.01.13-.03zm-1.05.42c0-.01-.06-.03-.13-.03s-.13.01-.13.03c0 .02.05.04.13.04.07 0 .12-.01.13-.03z"
      />
      <path
        fill="#e6e6e6"
        d="M6.79 19.72c0-.02-.12-.04-.27-.05-.14 0-.26 0-.26.03 0 .02.11.05.26.05.15 0 .26 0 .27-.03z"
      />
      <path
        fill="#3f3d56"
        d="M8.46 19.88c0-.03-.12-.05-.26-.05-.15 0-.27 0-.27.03 0 .02.12.04.26.05.15 0 .27-.01.27-.03z"
      />
      <path
        fill="#ff6584"
        d="M6.1 19.98c0-.02-.11-.04-.26-.05-.14 0-.26 0-.26.03 0 .02.12.05.26.05.15 0 .27 0 .27-.03zm1.81.25c0-.02-.11-.04-.26-.05-.15 0-.26.01-.27.03 0 .03.12.05.27.05.14.01.26 0 .26-.03z"
      />
      <path
        fill="#e6e6e6"
        d="M5.28 20.04c0-.02-.05-.03-.11-.03-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .11-.02.11-.04zm.65.16c0-.03-.05-.04-.11-.04-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .11-.02.11-.04z"
      />
      <path
        fill="#3f3d56"
        d="M4.87 20.25c0-.02-.05-.04-.12-.04-.06 0-.11.02-.11.04s.05.03.11.03c.07 0 .12-.01.12-.03z"
      />
      <path
        fill="#e6e6e6"
        d="M7.1 20c0-.03-.05-.04-.11-.04-.07 0-.12.01-.12.03 0 .02.05.04.12.04.06 0 .11-.02.11-.04z"
      />
      <path
        fill="#ff6584"
        d="M6.35 19.85c0-.02-.06-.04-.12-.04-.07 0-.12.02-.12.04s.05.03.12.03c.06 0 .12-.01.12-.03z"
      />
      <path
        fill="#3f3d56"
        d="M7.6 19.77c0-.02-.05-.04-.11-.04s-.12.01-.12.03c0 .02.05.04.12.04.06 0 .12-.01.12-.03zm-.95.43c0-.02-.05-.04-.12-.04-.06 0-.12.02-.12.04s.06.03.12.03c.07 0 .12-.01.12-.03z"
      />
      <path
        fill={newAccentColor}
        d="M19.74 17.9c-.37 0-.73-.13-1.01-.37-.1-.08-.2-.22-.3-.41a.95.95 0 0 1-.03-.82l-.18.15-.03.02v-.12c0-.14.1-.3.06-.43-.22-.56-.9-1.13.09-2 .09-.09-.03-.25-.03-.37 0-1.2 1.3-3 2.18-2.18.51.48 1.58.82 2.07 1.5l.01.01-.02.01c-.1.04-.2.07-.31.08.11.03.23.04.35.03h.01l.01.02c.04.17.06.35.06.53v.02a.97.97 0 0 0 .32.72 1.55 1.55 0 0 1 .51 1.15c0 .25-.17.59-.32.82a.47.47 0 0 1-.71.1c.07.14.16.27.27.38l.02.02-.03.01c-.24.14-.5.21-.78.21h-.01c-.42 0-.82.17-1.09.45a1.56 1.56 0 0 1-1.11.47z"
      />
      <path
        fill="#3f3d56"
        d="M19.2 20.33h-.03v-.03s-.12-.84-.02-1.95a7.33 7.33 0 0 1 1.36-3.73h.01v.01l.01.01v.02a7.28 7.28 0 0 0-1.32 3.7 9.27 9.27 0 0 0 0 1.97h-.02z"
      />
      <path
        fill="#3f3d56"
        d="M20.04 16.31h-.02l-.01-.02v-.03c.27-.18.56-.32.86-.43a2.98 2.98 0 0 1 1.92-.08v.03c0 .01 0 0 0 0l-.02.01a2.93 2.93 0 0 0-1.88.1 3.77 3.77 0 0 0-.85.42zm-1.3-3.29V13h.05a4 4 0 0 1 .5.82 2.98 2.98 0 0 1 .2 1.91h-.02l-.01-.02a2.93 2.93 0 0 0-.23-1.87 3.78 3.78 0 0 0-.49-.82z"
      />
      <path
        fill={newAccentColor}
        d="M3.15 17.43a1.51 1.51 0 0 0-1.08-.44h-.02c-.28 0-.54-.08-.78-.22l-.03-.01.02-.02c.11-.11.2-.24.27-.38a.46.46 0 0 1-.37.12.47.47 0 0 1-.34-.22 1.86 1.86 0 0 1-.32-.82 1.55 1.55 0 0 1 .5-1.15.97.97 0 0 0 .33-.72v-.02c0-.18.02-.36.06-.53V13h.02c.12 0 .24 0 .35-.03a.89.89 0 0 1-.31-.08h-.02v-.03c.5-.67 1.57-1.01 2.08-1.5.87-.82 2.18.99 2.18 2.2 0 .11-.12.28-.03.36.99.87.3 1.44.1 2-.06.14.05.29.05.43v.12l-.03-.02-.18-.15a.95.95 0 0 1-.03.82c-.1.2-.2.33-.3.41a1.55 1.55 0 0 1-2.12-.1z"
      />
      <path
        fill="#3f3d56"
        d="M4.8 20.33h.03v-.03s.12-.84.02-1.95a7.33 7.33 0 0 0-1.36-3.73l-.02.01v.03a7.28 7.28 0 0 1 1.32 3.7 9.27 9.27 0 0 1 0 1.97h.02z"
      />
      <path
        fill="#3f3d56"
        d="M3.96 16.31h.02l.01-.02v-.03a3.84 3.84 0 0 0-.86-.43 2.98 2.98 0 0 0-1.92-.08v.04h.03a2.93 2.93 0 0 1 1.87.1 3.78 3.78 0 0 1 .85.42zm1.3-3.29V13H5.2a4 4 0 0 0-.5.82 2.98 2.98 0 0 0-.21 1.91h.03l.01-.02c-.17-.74.03-1.43.23-1.87a3.78 3.78 0 0 1 .49-.82z"
      />
      <path
        fill="#e6e6e6"
        d="m4.94 7.36-2.86.04v.06l2.86-.05zm.06.16zm.04-.2a.08.08 0 0 0-.05.04v.06c0 .02 0 .03.02.05s.04.01.06.01c.02 0 .03 0 .05-.02a.08.08 0 0 0-.08-.14z"
      />
      <path fill="#3f3d56" d="M1.24 7.95a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path
        fill="#e6e6e6"
        d="M18.04 6.07v.06l2.86.04V6.1zm-.12.18zm0-.22a.08.08 0 0 0-.08.06.1.1 0 0 0 0 .05.08.08 0 0 0 .09.06.08.08 0 0 0 .07-.07.08.08 0 0 0-.08-.1z"
      />
      <path fill="#3f3d56" d="M21.75 6.66a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
      <path fill="#e6e6e6" d="m16.2 7.53-.55 2.81.06.01.55-2.81z" />
      <path
        fill="#e6e6e6"
        d="M16.1 7.39c0-.04.03-.07.05-.09a.14.14 0 1 1-.05.09zm.22.04v-.05a.09.09 0 0 0-.04-.04l-.06-.01a.08.08 0 1 0 .1.1z"
      />
      <path fill="#3f3d56" d="M15.51 11.67a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
    </SvgIcon>
  );
};

export default StandingPeopleIcon;
