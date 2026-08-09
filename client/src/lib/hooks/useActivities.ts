import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import type { Activity } from "../types";

const HOOK_KEY = 'activities';

export const useActivities = (id?: string) => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const {currentUser} = useAccount();

	const invalidateActivities = async() => {
		await queryClient.invalidateQueries({ queryKey: [HOOK_KEY] });
	}

	// Activity Liust
	const { data: activities, isLoading } = useQuery({
		queryKey: [HOOK_KEY],
		queryFn: async () => {
			const response = await agent.get<Activity[]>(`/${HOOK_KEY}`);
			return response.data;
		},
		enabled: !id && location.pathname === '/activities' && !!currentUser,
		select: data => {
			return data.map(activity => {
				return {
					...activity,
					isHost: currentUser?.id === activity.hostId,
					isGoing: activity.attendees.some(x => x.id === currentUser?.id)
				}
			})
		}
	});

	// Activity Detail
	const { data: activity, isLoading: isLoadingActivity} = useQuery({
		queryKey: [HOOK_KEY, id],
		queryFn: async () => {
			const response = await agent.get<Activity>(`/${HOOK_KEY}/${id}`);
			return response.data;
		},
		enabled: !!id && !!currentUser,
		select: data => {
			return {
				...data,
				isHost: currentUser?.id === data.hostId,
				isGoing: data.attendees.some(x => x.id === currentUser?.id)
			}
		}
	});

	const updateActivity = useMutation({
		mutationFn: async (activity: Activity) => {
			const response = await agent.put<Activity>(`/${HOOK_KEY}`, activity);
			return response.data;
		}, onSuccess: async () => {
			await invalidateActivities();
		}
	});

	const createActivity = useMutation({
		mutationFn: async (activity: Activity) => {
			const response = await agent.post<Activity>(`/${HOOK_KEY}`, activity);
			return response.data;
		}, onSuccess: async () => {
			await invalidateActivities();
		}
	})

	const deleteActivity = useMutation({
		mutationFn: async (id: string) => {
			const response = await agent.delete(`/${HOOK_KEY}/${id}`);
			return response.data;
		}, onSuccess: async () => {
			await invalidateActivities();
		}
	});

	const updateAttendance = useMutation({
		mutationFn: async (id: string) => {
			await agent.post(`/activities/${id}/attend`)
		},
		onMutate: async (activityId: string) => {
			await queryClient.cancelQueries({queryKey: ['activities', activityId]});

			const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId]);

			queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => {
				if (!oldActivity || !currentUser) {
					return oldActivity
				}

				const isHost = oldActivity.hostId === currentUser.id;
				const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id);

				return {
					...oldActivity,
					isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
					attendees: isAttending
						? isHost
							? oldActivity.attendees
							: oldActivity.attendees.filter(x => x.id !== currentUser.id)
						: [...oldActivity.attendees, {
							id: currentUser.id,
							displayName: currentUser.displayName,
							imageUrl: currentUser.imageUrl
						}]
				}
			});
			return {prevActivity};
		},
		onError: (error, activityId, context) => {
			if(context?.prevActivity) {
				queryClient.setQueryData(['activities', activityId], context.prevActivity)
			}
		}
	})

	return { activities, isLoading, activity, isLoadingActivity, updateActivity, createActivity, deleteActivity, updateAttendance };
}
