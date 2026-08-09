import { Box, Button } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { editProfileSchema, type EditProfileSchema } from "../../lib/schemas/editProfileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { useEffect } from "react";

type Props = {
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm({ setEditMode }: Props) {
    const { id } = useParams();
    const { updateProfile, profile } = useProfile(id)
    const { control, reset, handleSubmit, formState: { isDirty, isValid } } = useForm<EditProfileSchema, unknown, EditProfileSchema>({
            mode: 'onTouched',
            resolver: zodResolver(editProfileSchema)
        });


    const onSubmit = async (data: EditProfileSchema) => {
        updateProfile.mutate(data, {
            onSuccess: () => setEditMode(false)
        });
    }

    useEffect(() => {
        reset({
            displayName: profile?.displayName,
            bio: profile?.bio || ''
        });
    }, [profile, reset])


   return (
        <Box component='form'
            onSubmit={handleSubmit(onSubmit)}
            display='flex'
            flexDirection='column'
            alignContent='center'
            gap={3}
            mt={3}
        >
            <TextInput label='Display Name' name='displayName' control={control} />
            <TextInput
                label='Add your bio'
                name='bio'
                control={control}
                multiline
                rows={4}
            />
            <Button
                type='submit'
                variant='contained'
                disabled={!isValid || !isDirty || updateProfile.isPending}
            >
                Update profile
            </Button>
        </Box>
    );
}