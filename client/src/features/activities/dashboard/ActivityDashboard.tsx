import { Grid, List } from "@mui/material";
import ActivityList from "./ActivityList";

export default function ActivityDashboard() {

  return (
    <Grid container spacing={3}>
      <Grid size={7} >
        <List sx={{ pt: 0 }}>
          <ActivityList/>
        </List>
      </Grid>
      <Grid size={5}>
        Activity filters go here
      </Grid>
    </Grid>
  )
}
