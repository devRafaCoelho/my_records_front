import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AdbIcon from '@mui/icons-material/Adb'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import { logOut } from '../utils/storage'

function Header() {
  const { userData } = useAppContext()
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const navigate = useNavigate()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleAccountClick = () => {
    handleCloseUserMenu()
    navigate('/account')
  }

  const handleLogoutClick = () => {
    handleCloseUserMenu()
    logOut()
    navigate('/login')
  }

  const settings = [
    { name: 'Account', icon: <AccountCircleIcon />, onClick: handleAccountClick },
    { name: 'Logout', icon: <LogoutIcon />, onClick: handleLogoutClick }
  ]

  const getUserInitials = () => {
    if (!userData) return ''
    const firstNameInitial = userData.firstname?.charAt(0).toUpperCase()
    const lastNameInitial = userData.lastname?.charAt(0).toUpperCase()
    return `${firstNameInitial}${lastNameInitial}`
  }

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/home')}
          >
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              LOGO
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{getUserInitials() || <AccountCircleIcon />} </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.onClick}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {setting.icon}
                    <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
