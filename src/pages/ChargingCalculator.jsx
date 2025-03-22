import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Paper, IconButton, useMediaQuery } from '@mui/material';
import { ArrowBack, ArrowForward, KeyboardBackspace } from '@mui/icons-material';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { motion, AnimatePresence } from 'framer-motion';

function ChargingCalculator() {
  const carModels = [
    { model: 'neta-v2', name: 'Neta V II', image: '/neta-car.png', fuelEfficiency: 19.5, electricEfficiency: 18.5, costPerKWh: 4.2, fuelCostPerL: 34.28 },
    { model: 'neta-x', name: 'Neta X 480', image: '/neta-x.png', fuelEfficiency: 19.5, electricEfficiency: 14.2, costPerKWh: 4.2, fuelCostPerL: 34.28 }
  ];

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  const [carModelIndex, setCarModelIndex] = useState(0);
  const [kilometers, setKilometers] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chargingCost, setChargingCost] = useState({ min: 0, max: 0 });
  const [gasCost, setGasCost] = useState({ min: 0, max: 0 });
  const [isCalculated, setIsCalculated] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right, 0 for initial

  const currentCarModel = carModels[carModelIndex];

  // Handle touch events for car swiping
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Required minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    if (isCalculated) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (isCalculated) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isCalculated) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextCarModel();
    } else if (isRightSwipe) {
      handlePrevCarModel();
    }
  };

  const handleCarModelChange = (event) => {
    if (!isCalculated) {
      const selectedModel = event.target.value;
      const selectedIndex = carModels.findIndex(car => car.model === selectedModel);
      const direction = selectedIndex > carModelIndex ? 1 : -1;
      setSlideDirection(direction);
      setCarModelIndex(selectedIndex);
    }
  };

  const handleKilometersChange = (event) => {
    // Only allow numeric input
    const value = event.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setKilometers(value);
    }
  };

  // Calculate fuel cost
  const calculateFuel = (distance, efficiency, costPerL) => {
    const fuelConsumed = distance / efficiency;
    return fuelConsumed * costPerL;
  };

  // Calculate electric charging cost
  const calculateElectricCost = (distance, efficiency, costPerKWh) => {
    const unitsConsumed = (distance / 100) * efficiency;
    return unitsConsumed * costPerKWh;
  };

  // Round to range
  const roundToRange = (value, range) => {
    return `${Math.floor(value / range) * range}-${Math.ceil(value / range) * range}`;
  };

  const handleCalculate = () => {
    const km = parseFloat(kilometers);
    if (!isNaN(km) && km > 0) {
      // Calculate fuel cost
      const fuelCost = calculateFuel(km, currentCarModel.fuelEfficiency, currentCarModel.fuelCostPerL);

      // Calculate electric charging cost
      const electricCost = calculateElectricCost(km, currentCarModel.electricEfficiency, currentCarModel.costPerKWh);

      // Set charging and gas cost ranges
      setChargingCost({
        min: roundToRange(electricCost, 100).split('-')[0],
        max: roundToRange(electricCost, 100).split('-')[1]
      });

      setGasCost({
        min: roundToRange(fuelCost, 100).split('-')[0],
        max: roundToRange(fuelCost, 100).split('-')[1]
      });

      setExpanded(true);
      setIsCalculated(true);
    }
  };

  const handleReset = () => {
    setKilometers('');
    setExpanded(false);
    setIsCalculated(false);
  };

  const handlePrevCarModel = () => {
    if (!isCalculated) {
      setSlideDirection(-1);
      setCarModelIndex((prevIndex) => (prevIndex - 1 + carModels.length) % carModels.length);
    }
  };

  const handleNextCarModel = () => {
    if (!isCalculated) {
      setSlideDirection(1);
      setCarModelIndex((prevIndex) => (prevIndex + 1) % carModels.length);
    }
  };

  // Handler for back button click
  const handleBackClick = () => {
    window.location.href = '/';
  };

  // Variants for the car image animation
  const carVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      y: 100,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        y: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      y: 100,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        y: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: isLandscape && isMobile ? '100vh' : '100vh',
        backgroundImage: `url('/cal.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isLandscape && isMobile ? 'scroll' : 'fixed',
        display: 'flex',
        flexDirection: 'column',
        overflow: isLandscape && isMobile ? 'auto' : 'hidden',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: 'absolute',
          top: isMobile ? 10 : 20,
          left: isMobile ? 10 : 20,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          zIndex: 10,
          width: isMobile ? 20 : 48,
          height: isMobile ? 20 : 48,
        }}
        aria-label="back to homepage"
      >
        <KeyboardBackspace sx={{ fontSize: isMobile ? '1rem' : '2rem', color: '#003f88' }} />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          maxWidth: '1920px',
          mx: 'auto',
          width: '100%',
          px: isMobile ? 0 : 0,
          py: isMobile ? 0 : 0,
          overflowY: isLandscape && isMobile ? 'auto' : 'inherit',
        }}
      >
        {/* Clickable Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: isMobile ? 1 : 2, 
            pt: isMobile ? 3 : isTablet ? 10 : 15,
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://www.neta.co.th/th', '_blank')}
        >
          <img 
            src="/neta-logo.png" 
            alt="NETA" 
            style={{ 
              height: isMobile ? '40px' : '100px',
              maxWidth: '100%'
            }} 
          />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 400,
            color: '#000',
            mb: isMobile ? 2 : 4,
            textAlign: 'center',
            fontSize: isMobile ? '1rem' : isTablet ? '2.5rem' : '3rem',
          }}
        >
          ขับเท่านี้ ค่าชาร์จไฟเท่าไหน?
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: '80%',
            maxWidth: '800px',
            borderRadius: 4,
            overflow: 'hidden',
            mb: isMobile ? 2 : 4,
          }}
        >
          <Box
            sx={{
              p: isMobile ? 2 : 4,
              backgroundColor: 'white',
            }}
          >
            {/* Switch Between Calculator Form and Result Form */}
            {!expanded ? (
              <>
                {/* Car Selection */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: '#555',
                    fontSize: isMobile ? '1rem' : isTablet ? '1.8rem' : '2rem',
                  }}
                >
                  เลือกรุ่น
                </Typography>

                <FormControl fullWidth sx={{ mb: isMobile ? 3 : 4 }}>
                  <Select
                    value={currentCarModel.model}
                    onChange={handleCarModelChange}
                    displayEmpty
                    renderValue={currentCarModel.model !== '' ? undefined : () => (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#aaa', fontSize: isMobile ? '1rem' : '2rem' }}>
                        <span style={{ color: '#EAB142', marginRight: '5px' }}>▼</span>
                        <span>กรุณาเลือกรุ่น</span>
                      </Box>
                    )}
                    sx={{
                      borderRadius: 1,
                      height: isMobile ? '40px' : '100px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ddd',
                      },
                      '& .MuiSelect-select': {
                        padding: isMobile ? '4px' : '15px',
                      },
                    }}
                    disabled={isCalculated}
                  >
                    {carModels.map((car, index) => (
                      <MenuItem key={car.model} value={car.model}>
                        <Typography sx={{ fontWeight: 400, color: '#333', fontSize: isMobile ? '1rem' : isTablet ? '2rem' : '2.5rem' }}>
                          {car.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Kilometers Input - Only allow numbers */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: '#555',
                    fontSize: isMobile ? '1rem' : isTablet ? '1rem' : '2rem',
                  }}
                >
                  กิโลเมตรต่อวัน
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  value={kilometers}
                  onChange={handleKilometersChange}
                  placeholder="กิโลเมตร"
                  type="text"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  sx={{
                    mb: isMobile ? 3 : 4,
                    '& .MuiOutlinedInput-root': {
                      height: isMobile ? '40px' : '100px',
                      borderRadius: 1,
                      fontSize: isMobile ? '1rem' : isTablet ? '2rem' : '2.5rem',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '& input': {
                        padding: isMobile ? '10px' : '15px',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          fontSize: isMobile ? '1rem' : '2rem',
                        }}
                      >
                        กิโลเมตร
                      </Typography>
                    ),
                  }}
                />

                {/* Calculate Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: isMobile ? 0 : 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleCalculate}
                    sx={{
                      borderRadius: 25,
                      px: 4,
                      py: isMobile ? 1 : 1.5,
                      backgroundColor: '#003f88',
                      '&:hover': {
                        backgroundColor: '#002d63',
                      },
                      width: '70%',
                      fontSize: isMobile ? '1rem' : isTablet ? '1rem' : '2rem',
                      fontWeight: 500,
                      textTransform: 'none',
                    }}
                  >
                    คำนวณ <img src="/neta-arrow.svg" alt="NETA" style={{ height: isMobile ? '30px' : '40px', marginLeft: '8px' }} />
                  </Button>
                </Box>
              </>
            ) : (
              // Results display section
          <Box sx={{ textAlign: 'center', py: isMobile ? 0 : 2, }}>
            <Typography 
              sx={{ 
                fontSize: isMobile ? '1rem' : '2rem', 
                fontWeight: 500, 
                mb: 1,
                textAlign: 'left',
                px: 2,
              }}
            >
              เลือกรุ่น
            </Typography>

            <Box 
              sx={{ 
                width: '100%', 
                height: isMobile ? '30px' : '100px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: isMobile ? 1 : 3,
                overflowY: 'auto',  // เพิ่มการเลื่อนแนวนอน
              }}
            >
              <Typography sx={{ 
                fontSize: isMobile ? '1rem' : '2.5rem',
                padding: '0 8px',
              }}>
                {currentCarModel.name}
              </Typography>
            </Box>

            <Typography 
              sx={{ 
                fontSize: isMobile ? '1rem' : '2rem', 
                fontWeight: 500,
                mb: 1,
                textAlign: 'left',
                px: 2,
              }}
            >
              ค่าชาร์จไฟ
            </Typography>

            <Box 
              sx={{ 
                width: '90%', 
                height: isMobile ? '30px' : '100px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                px: isMobile ? 2 : 4,
                mb: isMobile ? 1 : 3,
                backgroundColor: '#f8f8f8',
                mx: 'auto',
                overflowY: 'auto',  // เพิ่มการเลื่อนแนวนอน
              }}
            >
              <EvStationIcon 
                sx={{ 
                  color: '#7ab8db', 
                  fontSize: isMobile ? '1.5rem' : '3rem',
                  mr: 1,
                  flexShrink: 0
                }} 
              />
              <Typography sx={{ 
                fontSize: isMobile ? '1rem' : '2rem', 
                mr: 1, 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                ค่าชาร์จไฟ
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: isMobile ? '1rem' : '3rem', 
                  fontWeight: 600, 
                  color: '#4caf50',
                  ml: 'auto',
                  mr: 1,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {chargingCost.min}-{chargingCost.max}
              </Typography>
              <Typography sx={{ 
                fontSize: isMobile ? '0.8rem' : '2rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                /บาท
              </Typography>
            </Box>

            <Box 
              sx={{ 
                width: '90%', 
                height: isMobile ? '30px' : '100px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                px: isMobile ? 2 : 4,
                mb: isMobile ? 1 : 3,
                backgroundColor: '#f8f8f8',
                mx: 'auto',
                overflowY: 'auto',  // เพิ่มการเลื่อนแนวนอน
              }}
            >
              <LocalGasStationIcon 
                sx={{ 
                  color: '#7ab8db', 
                  fontSize: isMobile ? '1.5rem' : '3rem',
                  mr: 1,
                  flexShrink: 0
                }} 
              />
              <Typography sx={{ 
                fontSize: isMobile ? '1rem' : '2rem', 
                mr: 1, 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                ค่าน้ำมัน
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: isMobile ? '1rem' : '3rem',  
                  fontWeight: 600, 
                  color: '#f44336',
                  ml: 'auto',
                  mr: 1,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {gasCost.min}-{gasCost.max}
              </Typography>
              <Typography sx={{ 
                fontSize: isMobile ? '0.8rem' : '2rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                /บาท
              </Typography>
            </Box>

            <Typography 
              sx={{ 
                fontSize: isMobile ? '1rem' : '2rem', 
                fontWeight: 500,
                mb: 1,
                textAlign: 'left',
                px: 2,
              }}
            >
              ระยะทาง
            </Typography>

            <Box 
              sx={{ 
                width: '100%', 
                height: isMobile ? '30px' : '100px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: isMobile ? 1 : 4,
                overflowY: 'auto',  // เพิ่มการเลื่อนแนวนอน
              }}
            >
              <Typography sx={{ 
                fontSize: isMobile ? '1.2rem' : '3rem',
                padding: '0 8px',
              }}>
                {kilometers} กิโลเมตร
              </Typography>
            </Box>

            {/* Reset Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2,
              overflowY: 'auto',  // เพิ่มการเลื่อนสำหรับส่วนของปุ่ม
              width: '100%'
            }}>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  borderRadius: 25,
                  px: 4,
                  py: isMobile ? 0.5 : 1.5,
                  backgroundColor: '#003f88',
                  '&:hover': {
                    backgroundColor: '#002d63',
                  },
                  width: '80%',
                  fontSize: isMobile ? '1rem' : isTablet ? '1rem' : '2rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  รีเซ็ต <img src="/neta-arrow.svg" alt="NETA" style={{ height: isMobile ? '30px' : '40px', marginLeft: '8px' }} />
                </Box>
              </Button>
            </Box>
          </Box>
            )}
          </Box>
        </Paper>

        {/* Car Image Section with Animation */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isLandscape && isMobile ? 'center' : 'flex-end',
            position: 'relative',
            mb: isMobile ? 2 : 4,
            mt: isLandscape && isMobile ? 2 : 0,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              borderRadius: 8,
              pt: isLandscape && isMobile ? 0 : 2,
              pb: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#333',
                fontWeight: 500,
                fontSize: isMobile ? '1rem' : isTablet ? '1rem' : '1.5rem',
                textAlign: 'center',
                mb: isMobile ? 1 : 2,
              }}
            >
              {currentCarModel.name}
            </Typography>
            
            {/* Animated Car Image */}
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={carModelIndex}
                custom={slideDirection}
                variants={carVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  width: '80%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={currentCarModel.image}
                  alt={currentCarModel.name}
                  style={{
                    width: '100%',
                    maxWidth: isLandscape && isMobile ? '60%' : '800px',
                    maxHeight: isLandscape && isMobile ? '10vh' : 'auto',
                    marginBottom: isMobile ? 0 : '20px',
                    objectFit: 'contain'
                  }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Buttons - Only show when not in result mode */}
            {!isCalculated && (
              <>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: '50%', 
                  left: isMobile ? '2%' : '5%', 
                  transform: 'translateY(50%)',
                  zIndex: 2
                }}>
                  <Button
                    onClick={handlePrevCarModel}
                    sx={{
                      minWidth: 'unset',
                      width: isMobile ? '30px' : isTablet ? '40px' : '60px',
                      height: isMobile ? '30px' : isTablet ? '40px' : '60px',
                      p: 0,
                      borderRadius: '50%',
                      backgroundColor: '#EAB142',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55c00',
                      },
                    }}
                  >
                    <ArrowBack sx={{ fontSize: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem' }} />
                  </Button>
                </Box>
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: '50%', 
                  right: isMobile ? '2%' : '5%', 
                  transform: 'translateY(50%)',
                  zIndex: 2
                }}>
                  <Button
                    onClick={handleNextCarModel}
                    sx={{
                      minWidth: 'unset',
                      width: isMobile ? '30px' : isTablet ? '40px' : '60px',
                      height: isMobile ? '30px' : isTablet ? '40px' : '60px',
                      p: 0,
                      borderRadius: '50%',
                      backgroundColor: '#EAB142',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55c00',
                      },
                    }}
                  >
                    <ArrowForward sx={{ fontSize: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem' }} />
                  </Button>
                </Box>
              </>
            )}
          </Box>
          
          {!isCalculated && (
            <Typography
              variant="body2"
              sx={{
                mt: isMobile ? 1 : 2,
                color: '#333',
                fontWeight: 500,
                fontSize: isMobile ? '0.8rem' : isTablet ? '1rem' : '1rem',
                textAlign: 'center',
              }}
            >
              หมุนเลือกรุ่น NETA ที่ต้องการ
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ChargingCalculator;