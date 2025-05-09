import React from "react";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import FlagImage from "../assets/flag.png";
import SchoolBadge from "../assets/school-badge.png";
import BackgroundImage from "../assets/DSS.jpg";
import { ArrowForward } from "@mui/icons-material";
import NewsImage1 from "../assets/news1.jpeg";
import NewsImage2 from "../assets/news2.jpeg";
import NewsImage3 from "../assets/news3.jpeg";
import ScoreboardImage from "../assets/scoreboard.jpeg";
import RadioImage from "../assets/DSSS.jpg";
import AcademicsImage from "../assets/exam.jpeg";
import ExtracurricularImage from "../assets/caded.jpeg";

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: { xs: 2, sm: 3 }, backgroundColor: "#f5f5f5" }}>
      {/* Header with Flag and School Badge */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          backgroundColor: "#fff",
          padding: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Avatar
          alt="School Flag"
          src={FlagImage}
          sx={{
            width: { xs: 60, sm: 80 },
            height: { xs: 60, sm: 80 },
            marginRight: { xs: 0, sm: 2 },
            marginBottom: { xs: 2, sm: 0 },
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            flexGrow: 1,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            margin: { xs: "10px 0", sm: 0 },
          }}
        >
          Welcome to the Government School Management Portal
        </Typography>
        <Avatar
          alt="School Badge"
          src={SchoolBadge}
          sx={{
            width: { xs: 60, sm: 80 },
            height: { xs: 60, sm: 80 },
            marginLeft: { xs: 0, sm: 2 },
            marginTop: { xs: 2, sm: 0 },
          }}
        />
      </Box>

      {/* Welcome Section with Background Image */}
      <Box
        sx={{
          position: "relative",
          height: "600px",
          marginBottom: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px) brightness(0.5)",
            transform: "scale(1.05)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            padding: 3,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome To
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            DS Senanayake College Ampara
          </Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>
            Celebrating 70 Years of Excellence ❤
          </Typography>
        </Box>
      </Box>

      {/* "The Beating Heart Of Digamadulla" Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 3,
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          The Beating Heart Of Digamadulla
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 3,
            lineHeight: 1.8,
            color: "#555",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "justify",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          D.S. Senanayake College, Ampara, is a respected national school in Sri Lanka's Eastern
          Province, known for its high-quality secondary education. It's recognized for its commitment
          to academic excellence and character development. With dedicated teachers, modern
          facilities, and a focus on holistic education, the school prepares students to become future
          leaders and responsible citizens.
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#388e3c" },
            fontWeight: "bold",
            padding: "10px 24px",
          }}
          onClick={() => window.open("https://dssca.edu.lk/extracurricular/", "_blank")}
          aria-label="Visit extracurricular activities page"
        >
          See More
        </Button>
      </Box>

      {/* News & Updates Section */}
      <Box
        sx={{
          backgroundColor: "#272727",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#f5f5f5",
            marginBottom: 3,
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          News & Updates
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            lineHeight: 1.8,
            color: "#f5f5f5",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Stay informed with the latest happenings at D.S. Senanayake College,
          Ampara. Explore our News & Updates for timely updates on achievements,
          events, and important announcements.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box
                component="img"
                src={NewsImage1}
                alt="2 Days to Go"
                sx={{
                  height: 160,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  2 Days to Go!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The excitement is building, and the countdown is on! Get ready
                  as D.S. Senanayake College, Ampara...
                </Typography>
              </CardContent>
              <Button
                size="small"
                variant="contained"
                sx={{
                  alignSelf: "center",
                  mb: 1,
                  mx: "auto",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
              >
                Read More
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box
                component="img"
                src={ScoreboardImage}
                alt="Scoreboard"
                sx={{
                  height: 160,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  SCORE-BOARD
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "center", mb: 1 }}
                >
                  (TEACHERS MATCH)
                </Typography>
                <Grid container spacing={1} sx={{ textAlign: "center", mb: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="h6">DSSNS TEAM</Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      72
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">ONE TEAM</Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      71
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Button
                size="small"
                variant="contained"
                sx={{
                  alignSelf: "center",
                  mb: 1,
                  mx: "auto",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
              >
                Read More
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box
                component="img"
                src={NewsImage2}
                alt="Battle of Digamadulla"
                sx={{
                  height: 160,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  Let's Make History...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Battle of Digamadulla 2025 – The pride of Ampara, D.S.
                  Senanayake National College, is ready to take on GNS in an
                  intense...
                </Typography>
              </CardContent>
              <Button
                size="small"
                variant="contained"
                sx={{
                  alignSelf: "center",
                  mb: 1,
                  mx: "auto",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
              >
                Read More
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box
                component="img"
                src={NewsImage3}
                alt="Teachers Match"
                sx={{
                  height: 160,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  Teachers Match Highlights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The Teachers Match at Battle of Digamadulla 2025 brought all
                  the drama, intensity, and excitement we hoped for!
                </Typography>
              </CardContent>
              <Button
                size="small"
                variant="contained"
                sx={{
                  alignSelf: "center",
                  mb: 1,
                  mx: "auto",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
              >
                Read More
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Online Learning Platform Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 3,
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          Online Learning Platform
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{
            mb: 3,
            color: "#333",
            textAlign: "center",
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
          }}
        >
          Introducing A New Way Of Learning
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            lineHeight: 1.8,
            color: "#555",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Introducing a new way of learning with our innovative Learning Management System (LMS).
          We're revolutionizing education by providing students and educators with a dynamic platform
          designed to inspire, engage, and empower. Embrace a future of limitless learning possibilities.
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: "#2e7d32",
              color: "#fff",
              "&:hover": { backgroundColor: "#1b5e20" },
              fontWeight: "bold",
              padding: "10px 24px",
            }}
          >
            ACCESS THE LMS
          </Button>
        </Box>
      </Box>

      {/* Arundlu DS Radio Stream Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 0, sm: 0 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={RadioImage}
          alt="Arundlu DS Radio Stream"
          sx={{
            height: { xs: 200, sm: 300 },
            width: "100%",
            objectFit: "cover",
          }}
        />
        <Box sx={{ padding: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: 2,
              textAlign: "center",
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            Introducing
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{
              mb: 3,
              color: "#333",
              textAlign: "center",
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            The "Arundlu DS" Radio Stream
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 4,
              lineHeight: 1.8,
              color: "#555",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Embark on a brand-new auditory adventure with 'Arundlu DS' Radio Stream.
            This innovative platform promises a fresh and unparalleled listening experience,
            bringing you the latest in music, news, and entertainment.
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: "#2e7d32",
                color: "#fff",
                "&:hover": { backgroundColor: "#1b5e20" },
                fontWeight: "bold",
                padding: "10px 24px",
                textAlign: "center",
              }}
              onClick={() => window.open("https://dssca.edu.lk/radio/", "_blank")}
              aria-label="Visit radio stream page"
            >
              TUNE IN
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Academics Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, padding: { xs: 0, sm: 3 }, marginLeft: 23 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: 3,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            Academics
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 3,
              lineHeight: 1.8,
              color: "#555",
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Explore the realm of academics at D.S. Senanayake College, Ampara, where knowledge meets excellence. Our commitment to quality education fosters a rich and holistic learning experience that empowers students for a successful future.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: "#2e7d32",
              color: "#fff",
              "&:hover": { backgroundColor: "#1b5e20" },
              fontWeight: "bold",
              padding: "10px 24px",
            }}
            onClick={() => window.open("https://dssca.edu.lk/academics/", "_blank")}
            aria-label="Visit academic activities page"
          >
            See More
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            component="img"
            src={AcademicsImage}
            alt="Academics"
            sx={{
              width: "45%",
              height: "auto",
              maxHeight: 350,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

      {/* Extra Curricular Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, marginLeft: 26 }}>
          <Box
            component="img"
            src={ExtracurricularImage}
            alt="Extra Curricular"
            sx={{
              width: "45%",
              height: "auto",
              maxHeight: 350,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        </Box>
        <Box sx={{ flex: 1, padding: { xs: 0, sm: 3 }, marginRight: 10 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: 3,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            Extra Curricular
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 3,
              lineHeight: 1.8,
              color: "#555",
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            D.S. Senanayake College, Ampara, offers diverse extracurricular activities, including sports, clubs, and societies, fostering talent and character. With top-notch facilities and experienced mentors, students uphold a legacy of excellence, preparing to excel in life's challenges.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: "#2e7d32",
              color: "#fff",
              "&:hover": { backgroundColor: "#1b5e20" },
              fontWeight: "bold",
              padding: "10px 24px",
            }}
            onClick={() => window.open("https://dssca.edu.lk/extracurricular/", "_blank")}
            aria-label="Visit extracurricular activities page"
          >
            See More
          </Button>
        </Box>
      </Box>

      {/* 70 Years and Counting Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 3,
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          70 Years and counting...
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            lineHeight: 1.8,
            color: "#555",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          A Glorious Journey Through Our School’s Illustrious History. Reminisce, celebrate, and cherish the remarkable milestones that have shaped D.S. Senanayake College, Ampara, into the esteemed institution it is today.
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: "#2e7d32",
              color: "#fff",
              "&:hover": { backgroundColor: "#1b5e20" },
              fontWeight: "bold",
              padding: "10px 24px",
            }}
            onClick={() => window.open("https://dssca.edu.lk/history/", "_blank")}
            aria-label="Visit history page"
          >
            SEE MORE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;