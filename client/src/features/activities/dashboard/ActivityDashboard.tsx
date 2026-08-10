import { Grid, List } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid size={8} >
        <List sx={{ pt: 0 }}>
          <ActivityList />
        </List>
      </Grid>
      <Grid 
        size={4}
        sx={{
          position: 'sticky',
          top: 112,
          alignSelf: 'flex-start'
        }}
      
      >
        <ActivityFilters />
      </Grid>
    </Grid>
  )
}
