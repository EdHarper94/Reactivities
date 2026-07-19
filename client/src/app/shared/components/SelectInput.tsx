import { FormControl, InputLabel, Select, MenuItem, type SelectProps, FormHelperText } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = UseControllerProps<T> & SelectProps & 
{
    label:string;
    items: {text: string, value: string}[];
} 

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});
  return (
    <FormControl fullWidth error={!!fieldState.error}>
        <InputLabel>{props.label}</InputLabel>
        <Select value={field.value || ''}
            label={props.label}
            onChange={field.onChange}
        >
            {props.items.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
        </Select>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}