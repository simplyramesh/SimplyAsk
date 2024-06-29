import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';


export const useNavigationBlock = (isBlocked) => {
  const navBlocker = useBlocker(
    ({ currentLocation, nextLocation }) => isBlocked && currentLocation.pathname !== nextLocation.pathname
  );

  return { navBlocker };
};

const BlockNavigate = ({ children, blocker, isBlocked }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (blocker?.state === 'blocked') {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }

    const handleBeforeUnload = (event) => {
      if (isBlocked) {
        const message = 'You have unsaved changes. Are you sure you want to reload?';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocked, blocker]);

  const handleSuccessClick = () => {
    setIsDialogOpen(false);
    blocker.reset();
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
    blocker.proceed();
  };

  return (
    <>
      {children?.({
        isDialogOpen,
        setIsDialogOpen,
        handleSuccessClick,
        handleCancelClick,
      })}
    </>
  );
};

export default BlockNavigate;
