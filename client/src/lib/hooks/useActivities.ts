import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

const HOOK_KEY = 'activities';

export const useActivities = (id?: string) => {
	const queryClient = useQueryClient();
	const invalidateActivities = async() => {
		await queryClient.invalidateQueries({ queryKey: [HOOK_KEY] });
	}

	const { data: activities, isPending } = useQuery({
		queryKey: [HOOK_KEY],
		queryFn: async () => {
			const response = await agent.get<Activity[]>(`/${HOOK_KEY}`);
			return response.data;
		}
	});

	const { data: activity, isLoading: isLoadingActivity} = useQuery({
		queryKey: [HOOK_KEY, id],
		queryFn: async () => {
			const response = await agent.get<Activity>(`/${HOOK_KEY}/${id}`);
			return response.data;
		},
		enabled: !!id
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

	return { activities, isPending, activity, isLoadingActivity, updateActivity, createActivity, deleteActivity };
}
