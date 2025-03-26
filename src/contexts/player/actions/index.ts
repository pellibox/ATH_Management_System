
import { useAddPlayer } from './useAddPlayer';
import { useUpdatePlayer } from './useUpdatePlayer';
import { useDeletePlayer } from './useDeletePlayer';
import { useMessagePlayer } from './useMessagePlayer';
import { usePlayerObjectives } from './usePlayerObjectives';
import { useActivitiesRegistration } from './useActivitiesRegistration';

export const usePlayerActions = (props: any) => {
  const addPlayerActions = useAddPlayer(props);
  const updatePlayerActions = useUpdatePlayer(props);
  const deletePlayerActions = useDeletePlayer(props);
  const messagePlayerActions = useMessagePlayer(props);
  const objectivesActions = usePlayerObjectives(props);
  const activitiesActions = useActivitiesRegistration(props);

  return {
    ...addPlayerActions,
    ...updatePlayerActions,
    ...deletePlayerActions,
    ...messagePlayerActions,
    ...objectivesActions,
    ...activitiesActions
  };
};

export type { PlayerActionsProps } from './types';
