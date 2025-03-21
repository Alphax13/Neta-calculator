import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function HomePage() {
  const navigate = useNavigate();
  const [logoFadeIn, setLogoFadeIn] = useState(false);
  const [textFadeIn, setTextFadeIn] = useState(false);
  const [buttonFadeIn, setButtonFadeIn] = useState(false);
  const [carFadeIn, setCarFadeIn] = useState(false);
  const [cloudsFadeIn, setCloudsFadeIn] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);

  // Function to reset and restart animations
  const startAnimationSequence = () => {
    // First set reset mode to true (all elements fade out)
    setResetAnimation(true);
    
    // After elements fade out, reset states and start sequence
    setTimeout(() => {
      setLogoFadeIn(false);
      setTextFadeIn(false);
      setButtonFadeIn(false);
      setCarFadeIn(false);
      setCloudsFadeIn(false);
      setResetAnimation(false);
      
      // Slight delay before starting next animation sequence
      setTimeout(() => {
        // Start sequence with delays
        setTimeout(() => setCloudsFadeIn(true), 50);  // Clouds first
        setTimeout(() => setLogoFadeIn(true), 100);   // Logo next
        setTimeout(() => setTextFadeIn(true), 800);
        setTimeout(() => setButtonFadeIn(true), 1500);
        setTimeout(() => setCarFadeIn(true), 2200);
      }, 100);
    }, 800); // Allow 800ms for fade out
  };

  useEffect(() => {
    // Initial animation start (without reset)
    setTimeout(() => setCloudsFadeIn(true), 50);  // Clouds first
    setTimeout(() => setLogoFadeIn(true), 100);   // Logo next
    setTimeout(() => setTextFadeIn(true), 800);
    setTimeout(() => setButtonFadeIn(true), 1500);
    setTimeout(() => setCarFadeIn(true), 2200);
    
    // Set up interval to restart animations every 5 seconds
    const intervalId = setInterval(() => {
      startAnimationSequence();
    }, 20000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
        position: 'relative',  // Added for absolute positioning of clouds
      }}
    >
      {/* Clouds */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: 0,
          opacity: resetAnimation ? 0 : (cloudsFadeIn ? 1 : 0),
          transform: cloudsFadeIn ? 'translateX(0)' : 'translateX(30px)',
          transition: 'transform 1s ease-out, opacity 1s ease-out',
          zIndex: 1,
        }}
      >
        <img
          src="/cloud1.png"  // Make sure to add this image to your public folder
          alt="Cloud"
          style={{
            width: '350px',
            transition: 'transform 1.5s ease-in-out',
            transform: resetAnimation ? 'translateX(100px)' : 'translateX(0)',
            animation: 'float 4s ease-in-out infinite',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: 0,
          opacity: resetAnimation ? 0 : (cloudsFadeIn ? 1 : 0),
          transform: cloudsFadeIn ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'transform 1s ease-out, opacity 1s ease-out',
          zIndex: 1,
        }}
      >
        <img
          src="/cloud2.png"  // Make sure to add this image to your public folder
          alt="Cloud"
          style={{
            width: '350px',
            transition: 'transform 1.5s ease-in-out',
            transform: resetAnimation ? 'translateX(-10px)' : 'translateX(0)',
            animation: 'float2 2s ease-in-out infinite',
          }}
        />
      </Box>

      {/* Logo Section */}
      <Box
        sx={{
          pt: 15,
          pb: 2,
          display: 'flex',
          justifyContent: 'center',
          opacity: resetAnimation ? 0 : (logoFadeIn ? 1 : 0),
          transform: logoFadeIn ? 'translateY(0)' : 'translateY(30px)',
          transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
          zIndex: 2,  // Higher than clouds
        }}
      >
        <img 
          src="/neta-logo.png" 
          alt="NETA Logo" 
          style={{ 
            height: '100px',
            transition: 'transform 0.8s ease-out',
            transform: resetAnimation ? 'scale(0.9)' : 'scale(1)'
          }} 
          onClick={() => window.open('https://www.neta.co.th/th', '_blank')}
        />
      </Box>

      {/* Thai Text Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          flexGrow: 1,
          opacity: resetAnimation ? 0 : (textFadeIn ? 1 : 0),
          transform: textFadeIn ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          zIndex: 2,  // Higher than clouds
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 400,
            color: '#4A494B',
            mb: 2,
            fontSize: '4rem',
          }}
        >
          ลองเช็กกันไหม ถ้าเราขับ
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              mr: 1,
              borderRadius: '50%',
              p: 1,
            }}
          >
            <img 
              src="/steering-wheel.png" 
              alt="Steering wheel" 
              style={{ 
                width: '150px', 
                height: '150px',
                transition: 'transform 0.8s ease-out',
                transform: resetAnimation ? 'rotate(-45deg)' : 'rotate(0deg)'
              }} 
            />
          </Box>
          <Typography
            variant="h2"
            component="span"
            sx={{
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#ff6600',
              display: 'inline',
              fontSize: '12rem',
            }}
          >
            NETA !
          </Typography>
        </Box>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            color: '#4A494B',
            mb: 6,
            fontSize: '6rem',
          }}
        >
          คุ้มค่าแค่ไหน
        </Typography>

        {/* Button with Neon Effect */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box 
            sx={{
              position: 'relative',
              opacity: resetAnimation ? 0 : (buttonFadeIn ? 1 : 0),
              transform: buttonFadeIn ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              zIndex: 2,
            }}
          >
            {/* Neon glow effect container */}
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                borderRadius: 30,
                background: 'transparent',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '4px',
                  background: 'transparent',
                  zIndex: 1,
                  borderRadius: 25,
                }}
              />
              {/* Animated neon border */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'conic-gradient(#097969, #50C878, #097969, #50C878, #097969)',
                  animation: 'animate 4s linear infinite',
                  zIndex: 0,
                }}
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculatorClick}
              sx={{
                position: 'relative',
                borderRadius: 25,
                px: 15,
                py: 1.5,
                fontSize: '2.5rem',
                fontWeight: 600,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                zIndex: 3,
                boxShadow: '0 0 30px rgba(0, 204, 255, 0.7)',
              }}
            >
              เช็กเลย <img 
                src="/neta-arrow.svg" 
                alt="" 
                style={{ 
                  marginLeft: '10px', 
                  height: '80px',
                  transition: 'transform 0.8s ease-out',
                  transform: resetAnimation ? 'translateX(-20px)' : 'translateX(0)'
                }} 
              />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Car Image Section */}
      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            left: '0',
            bottom: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: resetAnimation ? 0 : (carFadeIn ? 1 : 0),
            transform: carFadeIn ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            zIndex: 2,  // Higher than clouds
          }}
        >
          <img
            src="/charging-station.png"
            alt="Charging Station"
            style={{
              height: '550px',
              position: 'absolute',
              left: '10%',
              bottom: '55%',
              transition: 'transform 0.8s ease-out',
              transform: resetAnimation ? 'translateY(20px)' : 'translateY(0)'
            }}
          />

          <img
            src="/neta-car.png"
            alt="NETA V-II Electric Car"
            style={{
              width: '100%',
              maxWidth: '1000px',
              marginBottom: '20px',
              zIndex: '10',
              transition: 'transform 0.8s ease-out',
              transform: resetAnimation ? 'translateX(-30px)' : 'translateX(0)',
              animation: 'float 5s ease-in-out infinite',
              
            }}
          />

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontWeight: 400,
              color: '#333',
              mb: 6,
              fontSize: '1.5rem',
              textAlign: 'center',
            }}
          >
            NETA V-II, Your True Value City EV
          </Typography>
        </Box>
      </Box>

      {/* Cloud and neon animations keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float2 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes animate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default HomePage;