import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Paper } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

function ChargingCalculator() {
  const carModels = [
    { model: 'neta-v2', name: 'Neta V II Smart', image: '/neta-car.png', costPerKm: 0.5 },
    { model: 'neta-x', name: 'NETA X - ELECTRIC SUV', image: '/neta-x.png', costPerKm: 0.7 }
  ];

  const [carModelIndex, setCarModelIndex] = useState(0);
  const [kilometers, setKilometers] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chargingCost, setChargingCost] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false); // State to track if calculation is done

  const currentCarModel = carModels[carModelIndex];

  const handleCarModelChange = (event) => {
    if (!isCalculated) { // Only allow model change if calculation hasn't been done
      const selectedModel = event.target.value;
      const selectedIndex = carModels.findIndex(car => car.model === selectedModel);
      setCarModelIndex(selectedIndex);
    }
  };

  const handleKilometersChange = (event) => {
    setKilometers(event.target.value);
  };

  const handleCalculate = () => {
    const calculatedCost = (parseFloat(kilometers) * currentCarModel.costPerKm).toFixed(2);
    setChargingCost(calculatedCost);
    setExpanded(true);
    setIsCalculated(true); // Set the flag to true once calculation is done
  };

  const handlePrevCarModel = () => {
    if (!isCalculated) {
      setCarModelIndex((prevIndex) => (prevIndex - 1 + carModels.length) % carModels.length);
    }
  };

  const handleNextCarModel = () => {
    if (!isCalculated) {
      setCarModelIndex((prevIndex) => (prevIndex + 1) % carModels.length);
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pt: 6 }}>
          <img src="/neta-logo.png" alt="NETA" style={{ height: '80px' }} />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 400,
            color: '#000',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
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
                    fontSize: { xs: '1.5rem', md: '1.8rem', lg: '2rem' },
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
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#aaa', fontSize: { xs: '1.2rem', md: '1.5rem', lg: '2rem' } }}>
                        <span style={{ color: '#ff6600', marginRight: '5px' }}>▼</span>
                        <span>กรุณาเลือกรุ่น</span>
                      </Box>
                    )}
                    sx={{
                      borderRadius: 1,
                      height: '70px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ddd',
                      },
                      '& .MuiSelect-select': {
                        padding: '15px',
                      },
                    }}
                    disabled={isCalculated} // Disable car selection after calculation
                  >
                    {carModels.map((car, index) => (
                      <MenuItem key={car.model} value={car.model}>
                        <Typography sx={{ fontWeight: 500, color: '#333', fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' } }}>
                          {car.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Kilometers Input */}
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
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      height: '70px',
                      borderRadius: 1,
                      fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
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
                          fontSize: { xs: '1rem', md: '1.2rem', lg: '1.4rem' }
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
                      fontSize: { xs: '1.2rem', md: '1.4rem', lg: '1.6rem' },
                      fontWeight: 500,
                      textTransform: 'none',
                    }}
                  >
                    คำนวณ <span style={{ fontSize: '1.8rem', marginLeft: '10px' }}>▼</span>
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                  ค่าไฟที่ต้องชาร์จ (ต่อวัน):
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: '#2c7c2b' }}>
                    ค่าชาร์จไฟ: ฿{chargingCost.min} - ฿{chargingCost.max}
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: '#b31a1a' }}>
                    ค่าน้ำมัน: ฿{chargingCost.min} - ฿{chargingCost.max}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>

 {/* Car Image Section - Takes remaining space */}
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
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              backgroundColor: 'rgba(173, 216, 230, 0.3)',
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
            
            <img
              src={currentCarModel.image}
              alt={currentCarModel.name}
              style={{
                width: '100%',
                maxWidth: '800px',
                marginBottom: '20px',
              }}
            />
            
            {/* Navigation Buttons */}
            <Box sx={{ position: 'absolute', bottom: '50%', left: '5%', transform: 'translateY(50%)' }}>
              <Button
                onClick={handlePrevCarModel}
                sx={{
                  minWidth: 'unset',
                  width: { xs: '50px', md: '60px' },
                  height: { xs: '50px', md: '60px' },
                  p: 0,
                  borderRadius: '50%',
                  backgroundColor: '#ff6600',
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
                  backgroundColor: '#ff6600',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#e55c00',
                  },
                }}
              >
                <ArrowForward sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
              </Button>
            </Box>
          </Box>
          
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
        </Box>
      </Box>
    </Box>
  );
}

export default ChargingCalculator;
