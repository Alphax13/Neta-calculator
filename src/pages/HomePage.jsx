import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function HomePage() {
  const navigate = useNavigate();

  const handleCalculatorClick = () => {
    navigate('/calculator');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url('/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          pt: 6,
          pb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img src="/neta-logo.png" alt="NETA Logo" style={{ height: '250px' }} />
      </Box>

      {/* Thai Text Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          flexGrow: 1, // This makes sure the text section grows to fill the available space
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 400,
            color: '#333',
            mb: 4,
          }}
        >
          ลองเช็กกันไหม ถ้าเราขับ
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              mr: 1,
              backgroundColor: '#444',
              borderRadius: '50%',
              p: 1,
            }}
          >
            <img src="/steering-wheel.svg" alt="Steering wheel" style={{ width: '40px', height: '40px' }} />
          </Box>
          <Typography
            variant="h2"
            component="span"
            sx={{
              fontWeight: 700,
              color: '#ff6600',
              display: 'inline',
            }}
          >
            NETA !
          </Typography>
        </Box>

        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 500,
            color: '#333',
            mb: 4,
          }}
        >
          คุ้มค่าแค่ไหน
        </Typography>

        {/* Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculatorClick}
            sx={{
              borderRadius: 28,
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            เช็กเลย <img src="/neta-arrow.svg" alt="" style={{ marginLeft: '8px', height: '14px' }} />
          </Button>
        </Box>
      </Box>

      {/* Car Image Section */}
      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src="/charging-station.png"
            alt="Charging Station"
            style={{
              height: '150px',
              position: 'absolute',
              left: '10%',
              bottom: '35%',
            }}
          />

          <img
            src="/neta-car.png"
            alt="NETA V-II Electric Car"
            style={{
              width: '90%',
              maxWidth: '600px',
              marginBottom: '80px',
            }}
          />

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontWeight: 400,
              color: '#333',
              mb: 4,
              textAlign: 'center',
            }}
          >
            NETA V-II, Your True Value City EV
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
