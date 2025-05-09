import React from "react"; // Remove useState from the import
import "react-calendar/dist/Calendar.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material"; // Import Box from Material-UI

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Header />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: "60px", // Adjust based on header height
          paddingBottom: "20px",
          paddingLeft: { xs: "2px", sm: "20px", md: "20px" }, // Responsive padding
          paddingRight: { xs: "2px", sm: "20px", md: "20px" }, // Responsive padding
        }}
      >
        <Dashboard />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;