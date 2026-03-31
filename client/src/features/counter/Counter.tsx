import { Box, Button, ButtonGroup, List, ListItemText, Paper, Typography } from '@mui/material';
import { useStore } from '../../lib/hooks/useStore'
import { observer } from 'mobx-react-lite';

const Counter = observer(function Counter() {
  const {counterStore} = useStore();

  return (
    <Box display="flex" justifyContent="space-between">
      <Box sx={{width: '60%'}}>
        <Typography variant="h4" gutterBottom>{counterStore.title}</Typography>
        <Typography variant="h6">The count is: {counterStore.count}</Typography>
        <ButtonGroup sx={{mt: 3}}>
          <Button onClick={() => counterStore.decrement()} variant="contained" color="error">Decrement</Button>
          <Button variant="contained" color="success" onClick={() => counterStore.increment()}>Increment</Button>
          <Button variant="contained" color="primary" onClick={() => counterStore.increment(5)}>Increment by 5</Button>
        </ButtonGroup>
      </Box>
      <Paper sx={{width: '40%', p:4}}>
        <Typography variant="h5">Counter events ({counterStore.eventCount})</Typography>
        <List>
          {counterStore.events.map((event, index) => (
            <ListItemText key={index}>{event}</ListItemText>
          ))}
        </List>
      </Paper>
    </Box>
  )
});

export default Counter;