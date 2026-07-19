import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";
import { useAccount } from "./useAccount";

const HOOK_KEY = 'activities';

export const useActivities = (id?: string) => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const {currentUser} = useAccount();
	const invalidateActivities = async() => {
		await queryClient.invalidateQueries({ queryKey: [HOOK_KEY] });
	}

	const { data: activities, isLoading } = useQuery({
		queryKey: [HOOK_KEY],
		queryFn: async () => {
			const response = await agent.get<Activity[]>(`/${HOOK_KEY}`);
			return response.data;
		},
		enabled: !id && location.pathname === '/activities' && !!currentUser
	});

	const { data: activity, isLoading: isLoadingActivity} = useQuery({
		queryKey: [HOOK_KEY, id],
		queryFn: async () => {
			const response = await agent.get<Activity>(`/${HOOK_KEY}/${id}`);
			return response.data;
		},
		enabled: !!id && !!currentUser
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

	return { activities, isLoading, activity, isLoadingActivity, updateActivity, createActivity, deleteActivity };
}
