import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Sidemenu from "./Sidemenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);  // Mantiene el estado del Drawer cerrado por defecto
  const navigate = useNavigate();
  const toggleDrawer = (openState) => () => {
    setOpen(openState);  // Cambia el estado del Drawer solo cuando explícitamente se pasa un valor
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("");  // Navegar al login después del logout
  };

  const handleToolbarClick = () => {
    if (isLoggedIn) {
      return (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}  // Aquí solo abre el Drawer cuando se hace clic
          >
            <MenuIcon />
          </IconButton>
        </>
      );
    } else {
      return (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </>
      );
    }
  }

  // Verifica si hay un id_usuario en localStorage
  const isLoggedIn = localStorage.getItem("id_usuario") !== null;
  const userRut = isLoggedIn ? localStorage.getItem("user_rut") : null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {handleToolbarClick()}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PrestaBanco: Sistema de Préstamos Bancarios hola123
          </Typography>

          {/* Mostrar botones según si el usuario está logueado o no */}
          {!isLoggedIn && (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Registro
              </Button>
            </>
          )}
          {isLoggedIn && (
            <Button color="inherit" onClick={handleLogout}>
             {`Cerrar Sesion (${userRut})`}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Muestra el Sidemenu solo si el usuario está logueado */}
      {isLoggedIn && <Sidemenu open={open} toggleDrawer={toggleDrawer} />}
    </Box>
  );
}
