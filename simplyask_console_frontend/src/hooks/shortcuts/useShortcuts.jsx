import { useQuery } from '@tanstack/react-query';
import { getShortcuts } from '../../Services/axios/shortcuts';

export const GET_SHORTCUTS = 'getShortcuts';

export const useShortcuts = (params = {}, rest = {}) => {
  const {
    data: shortcuts,
    isPending: isShortcutsLoading,
    isFetching: isShortcutsFetching,
  } = useQuery({
    queryKey: [GET_SHORTCUTS, params],
    queryFn: () => getShortcuts(params),
    select: (res) => res.content,
    ...rest,
  });

  return {
    shortcuts: shortcuts || [],
    isShortcutsLoading,
    isShortcutsFetching,
  };
};
