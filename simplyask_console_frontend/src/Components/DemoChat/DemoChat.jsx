import { Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { StyledFlex } from '../shared/styles/styled';

const createWidgetDiv = (ivaAgentId, widgetId) => {
  const div = document.createElement('div');
  div.classList.add('simplyask-agent-widget');
  div.setAttribute('data-iva-agent-id', ivaAgentId);
  div.setAttribute('data-widget-id', widgetId);
  return div;
};

const DemoChat = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const ivaAgentId = params.get('ivaAgentId');
    const widgetId = params.get('widgetId');
    const widgetDiv = createWidgetDiv(ivaAgentId, widgetId);
    document.body.appendChild(widgetDiv);

    const loadScript = (src) => {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    };

    const interval = setTimeout(() => {
      loadScript(`${import.meta.env.VITE_SIMPLYASK_CDN}/widget/${import.meta.env.VITE_CHAT_WIDGET_FILE_NAME}`);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <PageLayout>
      <ContentLayout>
        <h1>This is a Symphona customer's page where they want to add a widget.</h1>
        <StyledFlex direction="row" gap="20px">
          <StyledFlex width="25%">
            <Skeleton animation={false} variant="rectangular" height={400} />
          </StyledFlex>
          <StyledFlex width="75%">
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
            <Skeleton animation={false} variant="rectangular" height={50} sx={{ marginBottom: '20px' }} />
          </StyledFlex>
        </StyledFlex>
        <Skeleton animation={false} variant="rectangular" height={60} sx={{ marginBottom: '20px' }} />
        <Skeleton animation={false} variant="rectangular" height={60} sx={{ marginBottom: '20px' }} />
        <Skeleton animation={false} variant="rectangular" height={60} sx={{ marginBottom: '20px' }} />
      </ContentLayout>
    </PageLayout>
  );
};

export default DemoChat;
