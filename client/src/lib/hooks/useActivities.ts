import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import { PagedList, type Activity } from "../types";
import { useStore } from "./useStore";

const HOOK_KEY = 'activities';

export const useActivities = (id?: string) => {
	const { activityStore: {filter, startDate} } = useStore();
	const queryClient = useQueryClient();
	const location = useLocation();
	const {currentUser} = useAccount();

	const invalidateActivities = async() => {
		await queryClient.invalidateQueries({ queryKey: [HOOK_KEY] });
	}

	// Activity List
	const { data: activitiesGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<PagedList<Activity, string>>({
		queryKey: [HOOK_KEY, filter, startDate],
		queryFn: async ({pageParam = null}) => {
			const response = await agent.get<PagedList<Activity, string>>(`/${HOOK_KEY}`, {
				params: {
					cursor: pageParam,
					pageSize: 3,
					filter,
					startDate
				}
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5,
		placeholderData: keepPreviousData,
		initialPageParam: null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: !id && location.pathname === '/' + HOOK_KEY && !!currentUser,
		select: data => ({
			...data,
			pages: data.pages.map((page) => ({
				...page,
				items: page.items.map(activity => {
					const host = activity.attendees.find(x => x.id === activity.hostId);
					return {
						...activity,
						isHost: currentUser?.id === activity.hostId,
						isGoing: activity.attendees.some(x => x.id === currentUser?.id),
						hostImageUrl: host?.imageUrl
					}
				})
			}))
		})
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
			const host = data.attendees.find(x => x.id === data.hostId);
			return {
				...data,
				isHost: currentUser?.id === data.hostId,
				isGoing: data.attendees.some(x => x.id === currentUser?.id),
				hostImageUrl: host?.imageUrl
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
			await agent.post(`/${HOOK_KEY}/${id}/attend`)
		},
		onMutate: async (activityId: string) => {
			await queryClient.cancelQueries({queryKey: [HOOK_KEY, activityId]});

			const prevActivity = queryClient.getQueryData<Activity>([HOOK_KEY, activityId]);

			queryClient.setQueryData<Activity>([HOOK_KEY, activityId], oldActivity => {
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
				queryClient.setQueryData([HOOK_KEY, activityId], context.prevActivity)
			}
		}
	})

	return { 
		activitiesGroup, 
		isLoading, 
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		activity, 
		isLoadingActivity, 
		updateActivity, 
		createActivity, 
		deleteActivity, 
		updateAttendance 
	};
}
