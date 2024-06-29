import { format } from 'date-fns';
import html2canvas from 'html2canvas';

export const getFeedbackInfo = (currentView) => {
  const browserName = navigator.userAgent
    .toLowerCase()
    .match(/(chrome|firefox|msie|trident|edge|safari)\//)[1];

  const browserVer = navigator.userAgent
    .match(/(chrome|firefox|msie|trident|edge|safari)\/?\s*([\d\\.]+)/i)[2];

  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const currentLanguage = navigator.language;
  const availableLanguages = navigator.languages;

  const deviceInfo = navigator.appVersion;

  return {
    browserInfo: {
      browserName,
      browserVer,
      screenResolution,
    },
    languages: {
      current: currentLanguage,
      available: availableLanguages,
    },
    appSessionInfo: {
      currentView: currentView || '',
      deviceInfo,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  };
};

export const removeBoxShadow = (element) => {
  const children = Array.from(element.children);

  const computedStyle = window.getComputedStyle(element);

  if (computedStyle.boxShadow !== 'none') {
    element.style['box-shadow'] = 'none';
  }

  const removedBoxShadow = children.map(removeBoxShadow).find(Boolean);

  return removedBoxShadow || element;
};

export const captureScreenshot = async () => {
  const target = document.body;

  const targetCanvas = await html2canvas(target, {
    allowTaint: true,
    useCORS: true,
    foreignObjectRendering: true, // helps svg elements show correctly
    width: target.offsetWidth,
    height: target.offsetHeight,
    onclone: (cloneDocument) => {
      const cloneBody = cloneDocument.body;

      // prevent 'must enable javascript' message from appearing in screenshot
      // when foreignObjectRendering is true
      const noscriptTags = Array.from(cloneDocument.getElementsByTagName('noscript'));
      noscriptTags.forEach((noscript) => { noscript.innerHTML = ''; });

      const cloneAppLayoutRight = cloneBody.querySelector('[class^="AppLayout_right__"]');

      // box-shadows appear over parts of main element child nodes
      removeBoxShadow(cloneAppLayoutRight);

      return cloneBody;
    },
  });

  return targetCanvas.toDataURL().replace('data:image/png;base64,', '');
};

export const generateDummyBreadCrumb = (pageName, pageUrlPath = '/') => ({ pageName, pageUrlPath });

export const getBreadcrumbs = (item, pages) => {
  if (!pages) return [];

  const breadcrumbs = [];

  const fillBreadcrumbs = (currentItem) => {
    if (!currentItem) return;
    breadcrumbs.push(currentItem);

    if (currentItem.parentPageId && currentItem.parentPageId !== currentItem.pageId) {
      const newItem = pages.find((i) => i.pageId === currentItem.parentPageId);

      fillBreadcrumbs(newItem);
    }
  };

  fillBreadcrumbs(item);

  return [...breadcrumbs.reverse()];
};
