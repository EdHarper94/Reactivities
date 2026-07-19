import { z } from 'zod';
import { requiredString } from '../util/utils';

export const activitySchema = z.object({
    title: requiredString('Title'),
    description: requiredString('Description'),
    category: requiredString('Category'),
    date: z.date({
        message: 'Date is required'
    }),
    location: z.object({
        venue: requiredString('Venue'),
        city: z.string().optional(),
        latitude: z.coerce.number(),
        longitude: z.coerce.number()
    })
})


export type ActivitySchema = z.infer<typeof activitySchema>;
export type ActivitySchemaInput = z.input<typeof activitySchema>;