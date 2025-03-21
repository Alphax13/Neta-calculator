import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Paper, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, KeyboardBackspace } from '@mui/icons-material';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { motion, AnimatePresence } from 'framer-motion';

function ChargingCalculator() {
  const carModels = [
    { model: 'neta-v2', name: 'Neta V II', image: '/neta-car.png', fuelEfficiency: 19.5, electricEfficiency: 18.5, costPerKWh: 4.2, fuelCostPerL: 34.28 },
    { model: 'neta-x', name: 'Neta X 480', image: '/neta-x.png', fuelEfficiency: 19.5, electricEfficiency: 14.2, costPerKWh: 4.2, fuelCostPerL: 34.28 }
  ];

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
        height: '100vh',
        backgroundImage: `url('/cal.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          zIndex: 10,
        }}
        aria-label="back to homepage"
      >
        <KeyboardBackspace sx={{ fontSize: '2rem', color: '#003f88' }} />
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
        }}
      >
        {/* Clickable Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2, 
            pt: 15,
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://www.neta.co.th/th', '_blank')}
        >
          <img src="/neta-logo.png" alt="NETA" style={{ height: '100px' }} />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 400,
            color: '#000',
            mb: 4,
            textAlign: 'center',
            fontSize: '3rem',
          }}
        >
          ขับเท่านี้ ค่าชาร์จไฟเท่าไหน?
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: '800px',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 4,
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
                    fontSize: '2rem',
                  }}
                >
                  เลือกรุ่น
                </Typography>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Select
                    value={currentCarModel.model}
                    onChange={handleCarModelChange}
                    displayEmpty
                    renderValue={currentCarModel.model !== '' ? undefined : () => (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#aaa', fontSize: '2rem' }}>
                        <span style={{ color: '#EAB142', marginRight: '5px' }}>▼</span>
                        <span>กรุณาเลือกรุ่น</span>
                      </Box>
                    )}
                    sx={{
                      borderRadius: 1,
                      height: '100px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ddd',
                      },
                      '& .MuiSelect-select': {
                        padding: '15px',
                      },
                    }}
                    disabled={isCalculated}
                  >
                    {carModels.map((car, index) => (
                      <MenuItem key={car.model} value={car.model}>
                        <Typography sx={{ fontWeight: 500, color: '#333', fontSize: '2.5rem' }}>
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
                    fontSize: { xs: '1.5rem', md: '1.8rem', lg: '2rem' },
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
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      height: '100px',
                      borderRadius: 1,
                      fontSize: '2.5rem',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '& input': {
                        padding: '15px',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          fontSize: '2rem',
                        }}
                      >
                        กิโลเมตร
                      </Typography>
                    ),
                  }}
                />

                {/* Calculate Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleCalculate}
                    sx={{
                      borderRadius: 25,
                      px: 6,
                      py: 1.5,
                      backgroundColor: '#003f88',
                      '&:hover': {
                        backgroundColor: '#002d63',
                      },
                      width: '80%',
                      fontSize: '2rem',
                      fontWeight: 500,
                      textTransform: 'none',
                    }}
                  >
                    คำนวณ <img src="/neta-arrow.svg" alt="NETA" style={{ height: '50px', marginLeft: '8px' }} />
                  </Button>
                </Box>
              </>
            ) : (
              // Results display section
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography 
                  sx={{ 
                    fontSize: '2rem', 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: 'left',
                    px: 2
                  }}
                >
                  เลือกรุ่น
                </Typography>

                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '100px',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <Typography sx={{ fontSize: '2.5rem' }}>
                    {currentCarModel.name}
                  </Typography>
                </Box>

                <Typography 
                  sx={{ 
                    fontSize: '2rem', 
                    fontWeight: 500,
                    mb: 2,
                    textAlign: 'left',
                    px: 2
                  }}
                >
                  ค่าชาร์จไฟ
                </Typography>

                <Box 
                  sx={{ 
                    width: '90%', 
                    height: '100px',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    px: 4,
                    mb: 3,
                    backgroundColor: '#f8f8f8'
                  }}
                >
                  <EvStationIcon 
                    sx={{ 
                      color: '#7ab8db', 
                      fontSize: '3rem',
                      mr: 2
                    }} 
                  />
                  <Typography sx={{ fontSize: '2rem', mr: 2 }}>
                    ค่าชาร์จไฟ
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '3rem', 
                      fontWeight: 600, 
                      color: '#4caf50',
                      ml: 'auto',
                      mr: 1,
                      flex: 1,
                      textAlign: 'right'
                    }}
                  >
                    {chargingCost.min}-{chargingCost.max}
                  </Typography>
                  <Typography sx={{ fontSize: '2rem', whiteSpace: 'nowrap' }}>
                    /บาท
                  </Typography>
                </Box>

                <Box 
                  sx={{ 
                    width: '90%', 
                    height: '100px',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    px: 4,
                    mb: 3,
                    backgroundColor: '#f8f8f8'
                  }}
                >
                  <LocalGasStationIcon 
                    sx={{ 
                      color: '#7ab8db', 
                      fontSize: '3rem',
                      mr: 2
                    }} 
                  />
                  <Typography sx={{ fontSize: '2rem', mr: 2 }}>
                    ค่าน้ำมัน
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '3rem',  
                      fontWeight: 600, 
                      color: '#f44336',
                      ml: 'auto',
                      mr: 1,
                      flex: 1,
                      textAlign: 'right'
                    }}
                  >
                    {gasCost.min}-{gasCost.max}
                  </Typography>
                  <Typography sx={{ fontSize: '2rem', whiteSpace: 'nowrap' }}>
                    /บาท
                  </Typography>
                </Box>

                <Typography 
                  sx={{ 
                    fontSize: '2rem', 
                    fontWeight: 500,
                    mb: 2,
                    textAlign: 'left',
                    px: 2
                  }}
                >
                  ระยะทาง
                </Typography>

                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '100px',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4
                  }}
                >
                  <Typography sx={{ fontSize: '3rem' }}>
                    {kilometers} กิโลเมตร
                  </Typography>
                </Box>

                {/* Reset Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{
                      borderRadius: 25,
                      px: 6,
                      py: 1.5,
                      backgroundColor: '#003f88',
                      '&:hover': {
                        backgroundColor: '#002d63',
                      },
                      width: '80%',
                      fontSize: '2rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    รีเซ็ต <img src="/neta-arrow.svg" alt="NETA" style={{ height: '50px', marginLeft: '8px' }} />
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>{/* Car Image Section with Animation */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            mb: 4,
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
              pt: 2,
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
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textAlign: 'center',
                mb: 2,
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
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={currentCarModel.image}
                  alt={currentCarModel.name}
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    marginBottom: '20px',
                  }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Buttons - Only show when not in result mode */}
            {!isCalculated && (
              <>
                <Box sx={{ position: 'absolute', bottom: '50%', left: '5%', transform: 'translateY(50%)' }}>
                  <Button
                    onClick={handlePrevCarModel}
                    sx={{
                      minWidth: 'unset',
                      width: { xs: '50px', md: '60px' },
                      height: { xs: '50px', md: '60px' },
                      p: 0,
                      borderRadius: '50%',
                      backgroundColor: '#EAB142',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55c00',
                      },
                    }}
                  >
                    <ArrowBack sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
                  </Button>
                </Box>
                
                <Box sx={{ position: 'absolute', bottom: '50%', right: '5%', transform: 'translateY(50%)' }}>
                  <Button
                    onClick={handleNextCarModel}
                    sx={{
                      minWidth: 'unset',
                      width: { xs: '50px', md: '60px' },
                      height: { xs: '50px', md: '60px' },
                      p: 0,
                      borderRadius: '50%',
                      backgroundColor: '#EAB142',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55c00',
                      },
                    }}
                  >
                    <ArrowForward sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
                  </Button>
                </Box>
              </>
            )}
          </Box>
          
          {!isCalculated && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#333',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', md: '1.1rem', lg: '1.3rem' },
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