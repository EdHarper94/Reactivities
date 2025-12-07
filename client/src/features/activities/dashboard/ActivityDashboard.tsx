import { Grid, List } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

type Props = {
    activities: Activity[];

    selectedActivity?: Activity | null;
    selectActivity?: (id: string) => void;
    cancelSelectActivity?: () => void;

    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean;
}

export default function ActivityDashboard({activities, 
    selectedActivity, selectActivity, cancelSelectActivity, 
    openForm, closeForm, editMode}: Props
  ) {
  return (
    <Grid container spacing={3}>
        <Grid size={7} >
            <List sx={{pt: 0}}>
                <ActivityList 
                  activities={activities} 
                  selectActivity={selectActivity} 
                  />
            </List>
        </Grid>
        <Grid size={5}>
          { selectedActivity && !editMode 
            && <ActivityDetail 
                  selectedActivity={selectedActivity} 
                  cancelSelectActivity={cancelSelectActivity} 
                  openForm={openForm} 
                />     
          }
          { editMode 
            && <ActivityForm activity={selectedActivity} closeForm={closeForm} />}
        </Grid>
    </Grid> 
  )
}
