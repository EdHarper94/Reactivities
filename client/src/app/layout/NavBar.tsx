import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Typography, Container, MenuItem, LinearProgress, CircularProgress } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useAccount } from "../../lib/hooks/useAccount";
import UserMenu from "./UserMenu";

export default function NavBar() {
    const { uiStore } = useStore();
    const { currentUser } = useAccount();
  return (
     <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" 
        sx={{ 
            backgroundImage: "linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)"
            }}>
        <Container maxWidth="xl">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <MenuItem component={NavLink} to='/' sx={{display: "flex", gap: 2}}>
                        <Group fontSize="large"></Group>
                        <Typography variant="h4" fontWeight="bold" sx={{ position: 'relative' }}>
                            Reactivities
                        </Typography>
                        <Observer>
                        {() => uiStore.isLoading ? (
                            <CircularProgress 
                                size={20}
                                thickness={7}
                                sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '30%',
                                    left: '105%'
                                }}
                            />
                        ) : null}
                        </Observer>
                    </MenuItem>
                </Box>
                <Box sx={{ display: "flex", gap: 4 }}>
                    <MenuItemLink to='/activities'>
                        Activities
                    </MenuItemLink>
                     <MenuItemLink to='/counter'>
                        Counter
                    </MenuItemLink>
                     <MenuItemLink to='/Errors'>
                        Errors
                    </MenuItemLink>
                </Box>
                <Box
                    display={'flex'} alignItems={'center'}
                >
                    {currentUser ? (
                        <UserMenu />
                    ): (
                        <>
                            <MenuItemLink to="/login">Login</MenuItemLink>
                            <MenuItemLink to="/register">Register</MenuItemLink>
                        </>
                    )}
                </Box>
            </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
