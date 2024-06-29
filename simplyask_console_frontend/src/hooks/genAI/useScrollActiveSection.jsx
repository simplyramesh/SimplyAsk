import { useState } from 'react';
export const useScrollActiveSection = (sections) => {
  const [activeId, setActiveId] = useState(sections[0]);

  const handleScroll = () => {
    const visibleSections = sections.filter((id) => {
      const element = document.getElementById(id);
      const { top, bottom } = element.getBoundingClientRect() || {};

      return element && top <= window.innerHeight && bottom >= window.innerHeight / 2;
    });

    const topMostVisibleSection = visibleSections[0];
    if (topMostVisibleSection) {
      setActiveId(topMostVisibleSection);
    }
  };

  return { activeId, handleScroll };
};
