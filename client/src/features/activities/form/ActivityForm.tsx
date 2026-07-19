import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form'
import { useEffect } from "react";
import { activitySchema, type ActivitySchema, type ActivitySchemaInput } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import LocationInput from "../../../app/shared/components/LocationInput";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";

export default function ActivityForm() {
	const { control, reset, handleSubmit} = useForm<ActivitySchemaInput, unknown, ActivitySchema>({
		mode: 'onTouched',
		resolver: zodResolver(activitySchema)
	});
	const navigate = useNavigate();
	const { id } = useParams();
	const { updateActivity, createActivity, activity } = useActivities(id);

	useEffect(() => {
		if (activity) reset({
			...activity,
			date: activity.date ? new Date(activity.date) : new Date(),
			location: {
				city: activity.city,
				venue: activity.venue,
				latitude: activity.latitude,
				longitude: activity.longitude
			}
		});
	}, [activity, reset]);

	const onSubmit = async (data: ActivitySchema) => {
		const {location, ...rest} = data;
		const flattenedData = {...rest, ...location};
		
		try {
			if (activity) {
				updateActivity.mutate({...activity, ...flattenedData}, {
					onSuccess: () => navigate(`/activities/${activity.id}`)
				})
			} else {
				createActivity.mutate({...flattenedData}, {
					onSuccess: (id) => navigate(`/activities/${id}`)
				})
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Paper sx={{ p: 3 }}>
			<Typography variant="h5" gutterBottom color="primary">
				{activity ? 'Edit Activity' : 'Create Activity'}
			</Typography>
			<Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
				<TextInput label='Title' control={control} name='title'/>
				<TextInput label='Description' control={control} name='description' multiline rows={3}/>
				<Box display='flex' gap={3}>
					<SelectInput items={categoryOptions} label='Category' control={control} name='category'/>
					<DateTimeInput label='Date' control={control} name='date'/>
				</Box>
				<LocationInput label='Enter the location' control={control} name="location"></LocationInput>
				<Box display="flex" justifyContent="end" gap={3}>
					<Button color="success" type="submit" disabled={updateActivity.isPending || createActivity.isPending}>Submit</Button>
					<Button component={Link} to='/activities' color="inherit" onClick={() => { }}>Cancel</Button>
				</Box>
			</Box>
		</Paper>
	)
}
