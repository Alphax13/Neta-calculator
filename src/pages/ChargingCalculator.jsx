import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Paper } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

function ChargingCalculator() {
  const carModels = [
    { model: 'neta-v2', name: 'Neta V II', image: '/neta-car.png', fuelEfficiency: 24.31, electricEfficiency: 18.5, costPerKWh: 4.2, fuelCostPerL: 32.44 }, // เพิ่มราคาน้ำมัน
    { model: 'neta-x', name: 'Neta X 480', image: '/neta-x.png', fuelEfficiency: 24.31, electricEfficiency: 14.2, costPerKWh: 4.2, fuelCostPerL: 32.44 } // เพิ่มราคาน้ำมัน
  ];

  const [carModelIndex, setCarModelIndex] = useState(0);
  const [kilometers, setKilometers] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chargingCost, setChargingCost] = useState({ min: 0, max: 0 });
  const [gasCost, setGasCost] = useState({ min: 0, max: 0 });
  const [isCalculated, setIsCalculated] = useState(false);

  const currentCarModel = carModels[carModelIndex];

  const handleCarModelChange = (event) => {
    if (!isCalculated) {
      const selectedModel = event.target.value;
      const selectedIndex = carModels.findIndex(car => car.model === selectedModel);
      setCarModelIndex(selectedIndex);
    }
  };

  const handleKilometersChange = (event) => {
    setKilometers(event.target.value);
  };

  // คำนวณค่าน้ำมัน
  const calculateFuel = (distance, efficiency, costPerL) => {
    const fuelConsumed = distance / efficiency;
    return fuelConsumed * costPerL;
  };

  // คำนวณค่าชาร์จไฟฟ้า
  const calculateElectricCost = (distance, efficiency, costPerKWh) => {
    const unitsConsumed = (distance / 100) * efficiency;
    return unitsConsumed * costPerKWh;
  };

  // ปัดค่าให้เป็นช่วง
  const roundToRange = (value, range) => {
    return `${Math.floor(value / range) * range}-${Math.ceil(value / range) * range}`;
  };

  const handleCalculate = () => {
    const km = parseFloat(kilometers);
    if (!isNaN(km) && km > 0) {
      // คำนวณค่าน้ำมัน
      const fuelCost = calculateFuel(km, currentCarModel.fuelEfficiency, currentCarModel.fuelCostPerL);

      // คำนวณค่าชาร์จไฟฟ้า
      const electricCost = calculateElectricCost(km, currentCarModel.electricEfficiency, currentCarModel.costPerKWh);

      // ตั้งค่าผลลัพธ์ค่าชาร์จไฟฟ้าและค่าน้ำมันเป็นช่วง
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pt: 15 }}>
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
                    คำนวณ <span style={{ fontSize: '1.8rem', marginLeft: '10px' }}>▼</span>
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
        </Paper>{/* Car Image Section - Takes remaining space */}
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
