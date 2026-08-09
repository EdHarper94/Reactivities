import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo } from "react";
import type { Photo, Profile, User } from "../types";
import { useAccount } from "./useAccount";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

const HOOK_KEY = 'profiles';
const USER_QK = ['user'];

export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();
    const {currentUser} = useAccount();

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`${HOOK_KEY}/${id}`);
            return response.data
        },
        enabled: !!id
    });

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`${HOOK_KEY}/${id}/photos`);
            return response.data
        },
        enabled: !!id
    });

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: {'Content-type': 'multipart/form-data'}
            });
            return response.data;
        },
        onSuccess: async (photo: Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', id]
            });
            queryClient.setQueryData(USER_QK, (data: User) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
        }
    });

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`${HOOK_KEY}/${photo.id}/setMain`, {});
        },
        onSuccess: (_, photo) => {
            queryClient.setQueryData(USER_QK, (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                if (!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url
                }
            });
        }
    });

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`${HOOK_KEY}/${photoId}/photos`);
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(p => p.id !== photoId);
            });
        }
    })

    const isCurrentUser = useMemo(() => {
      return id === queryClient.getQueryData<User>(USER_QK)?.id
    }, [id, queryClient])

    const updateProfile = useMutation({
        mutationFn: async (profile: EditProfileSchema) => {
            await agent.put(`${HOOK_KEY}`, profile);
        },
        onMutate: async (profile: EditProfileSchema) => {
            const profileQK = ['profile', id];
  
            await queryClient.cancelQueries({queryKey: profileQK});
            await queryClient.cancelQueries({queryKey: USER_QK});

            const prevProfile = queryClient.getQueryData<Profile>(profileQK);
            const prevUser = queryClient.getQueryData<User>(USER_QK);

            queryClient.setQueryData<Profile>(profileQK, oldProfile => {
                if(!oldProfile || !currentUser)
                    return oldProfile;

                return {...oldProfile, ...profile};
            });

            if (isCurrentUser) {
                queryClient.setQueryData<User>(USER_QK, oldUser => {
                    if (!oldUser) return oldUser;
                    return {...oldUser, displayName: profile.displayName};
                });
            }

            return {prevProfile, prevUser};
        },
        onError: (error, profile, context) => {
            if(context?.prevProfile) {
                queryClient.setQueryData(['profile', id], context.prevProfile);
            }
            if(context?.prevUser) {
                queryClient.setQueryData(USER_QK, context.prevUser);
            }
        }
    })

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto,
        updateProfile
    }
}
