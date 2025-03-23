import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Paper, IconButton, useMediaQuery } from '@mui/material';
import { ArrowBack, ArrowForward, KeyboardBackspace } from '@mui/icons-material';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { motion, AnimatePresence } from 'framer-motion';

function ChargingCalculator() {
  const carModels = [
    { 
      model: 'neta-v2', 
      name: 'Neta V - II', 
      image: '/neta-car.png', 
      fuelEfficiencyMin: 11,  // อัตราสิ้นเปลืองน้ำมันต่ำสุด (km/L)
      fuelEfficiencyMax: 20,  // อัตราสิ้นเปลืองน้ำมันสูงสุด (km/L)
      electricEfficiencyMin: 11,  // อัตราสิ้นเปลืองไฟฟ้าต่ำสุด (kWh/100km)
      electricEfficiencyMax: 20,  // อัตราสิ้นเปลืองไฟฟ้าสูงสุด (kWh/100km)
      costPerKWh: 2.9709, 
      fuelCostPerL: 34.28 
    },
    { 
      model: 'neta-x', 
      name: 'Neta X', 
      image: '/neta-x.png', 
      fuelEfficiencyMin: 11, 
      fuelEfficiencyMax: 20, 
      electricEfficiencyMin: 11, 
      electricEfficiencyMax: 20, 
      costPerKWh: 2.9709, 
      fuelCostPerL: 34.28 
    }
  ];

  // ตรวจสอบขนาดหน้าจอสำหรับการแสดงผลแบบ Responsive
  const isMobile = useMediaQuery('(max-width:600px)');  // สำหรับมือถือ
  const isTablet = useMediaQuery('(max-width:960px)');  // สำหรับแท็บเล็ต
  const isLandscape = useMediaQuery('(orientation: landscape)');  // สำหรับแนวนอน
  
  const [carModelIndex, setCarModelIndex] = useState(0);
  const [kilometers, setKilometers] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chargingCostMin, setChargingCostMin] = useState(0);
  const [chargingCostMax, setChargingCostMax] = useState(0);
  const [gasCostMin, setGasCostMin] = useState(0);
  const [gasCostMax, setGasCostMax] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0); // -1 เลื่อนไปซ้าย, 1 เลื่อนไปขวา, 0 ค่าตั้งต้น

  const currentCarModel = carModels[carModelIndex];

  // จัดการการสัมผัสหน้าจอเพื่อเปลี่ยนรุ่นรถ
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // ระยะที่ต้องลากขั้นต่ำเพื่อให้ถือว่าเป็นการ swipe (พิกเซล)
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
      handleNextCarModel(); // เลื่อนเลือกรถไปทางขวา
    } else if (isRightSwipe) {
      handlePrevCarModel(); // เลื่อนเลือกรถไปทางซ้าย
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
    // อนุญาตให้กรอกเฉพาะตัวเลขเท่านั้น
    const value = event.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setKilometers(value);
    }
  };

  // ฟังก์ชันคำนวณค่าน้ำมัน
  const calculateFuel = (distance, efficiencyMin, efficiencyMax, costPerL) => {
    const fuelConsumedMin = distance / efficiencyMax; // ใช้ค่า max efficiency เพื่อหาค่าน้ำมันต่ำสุด
    const fuelConsumedMax = distance / efficiencyMin; // ใช้ค่า min efficiency เพื่อหาค่าน้ำมันสูงสุด
    
    return {
      min: fuelConsumedMin * costPerL,
      max: fuelConsumedMax * costPerL
    };
  };

  // ฟังก์ชันคำนวณค่าไฟฟ้าชาร์จ
  const calculateElectricCost = (distance, efficiencyMin, efficiencyMax, costPerKWh) => {
    const unitsConsumedMin = (distance / 100) * efficiencyMin; // ใช้ค่า min efficiency เพื่อหาค่าไฟต่ำสุด
    const unitsConsumedMax = (distance / 100) * efficiencyMax; // ใช้ค่า max efficiency เพื่อหาค่าไฟสูงสุด
    
    return {
      min: unitsConsumedMin * costPerKWh,
      max: unitsConsumedMax * costPerKWh
    };
  };

  const handleCalculate = () => {
    const km = parseFloat(kilometers);
    if (!isNaN(km) && km > 0) {
      // คำนวณค่าน้ำมัน
      const fuelCost = calculateFuel(
        km, 
        currentCarModel.fuelEfficiencyMin, 
        currentCarModel.fuelEfficiencyMax, 
        currentCarModel.fuelCostPerL
      );
      
      // คำนวณค่าไฟฟ้าสำหรับชาร์จ
      const electricCost = calculateElectricCost(
        km, 
        currentCarModel.electricEfficiencyMin, 
        currentCarModel.electricEfficiencyMax, 
        currentCarModel.costPerKWh
      );
      
      // เก็บค่าที่คำนวณได้โดยตรง แทนการปัดเศษ
      setChargingCostMin(electricCost.min.toFixed(2));
      setChargingCostMax(electricCost.max.toFixed(2));
      setGasCostMin(fuelCost.min.toFixed(2));
      setGasCostMax(fuelCost.max.toFixed(2));

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

  // ฟังก์ชันเมื่อกดปุ่มย้อนกลับ
  const handleBackClick = () => {
    window.location.href = '/';
  };

  // ตัวเลือกการเคลื่อนไหวของภาพรถ (ถ้ามี framer-motion)
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
            mb: isMobile ? 1 : 1, 
            pt: isMobile ? 3 : isTablet ? 10 : 10,
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://www.neta.co.th/th', '_blank')}
        >
          <img 
            src="/neta-logo.png" 
            alt="NETA" 
            style={{ 
              height: isMobile ? '40px' : '80px',
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
            height: 'auto', // Changed from '100%' to 'auto'
            width: '90%',
            maxWidth: '800px',
            borderRadius: 4,
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

                <FormControl fullWidth sx={{ mb: isMobile ? 3 : 2 }}>
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
                      height: isMobile ? '40px' : '80px',
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
                    fontSize: isMobile ? '1rem' : isTablet ? '1.8rem' : '2rem',
                  }}
                >
                  ระยะทางการขับขี่
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  value={kilometers}
                  onChange={handleKilometersChange}
                  placeholder="กิโลเมตร"
                  type="number"  // เปลี่ยนเป็น type="number" เพื่อให้รองรับการกรอกตัวเลข
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    min: 10  // เพิ่ม min เพื่อกำหนดค่าขั้นต่ำที่ 10
                  }}
                  sx={{
                    mb: isMobile ? 3 : 4,
                    '& .MuiOutlinedInput-root': {
                      height: isMobile ? '40px' : '80px',
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

            <Box 
              sx={{ 
                width: '100%', 
                height: isMobile ? '30px' : '80px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: isMobile ? 1 : 3,
              }}
            >
              <Typography sx={{ 
                fontSize: isMobile ? '1rem' : '2.5rem',
                padding: '0 8px',
              }}>
                {currentCarModel.name}
              </Typography>
            </Box>


            <Box 
              sx={{ 
                width: '90%', 
                height: isMobile ? '30px' : '80px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                px: isMobile ? 2 : 4,
                mb: isMobile ? 1 : 1,
                backgroundColor: '#f8f8f8',
                mx: 'auto',
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
                fontSize: isMobile ? '1rem' : '1.5rem', 
                mr: 1, 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                ค่าชาร์จไฟ
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: isMobile ? '1rem' : '2rem', 
                  fontWeight: 600, 
                  color: '#4caf50',
                  ml: 'auto',
                  mr: 1,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {chargingCostMin} - {chargingCostMax}
              </Typography>
              <Typography sx={{ 
                fontSize: isMobile ? '0.8rem' : '2rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                /ต่อบาท*
              </Typography>
            </Box>
            <Typography sx={{ 
                fontSize: isMobile ? '0.8rem' : '1.5rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                มิเตอร์ TOU ช่วงเวลา Off-peak*
              </Typography>
            <Box 
              sx={{ 
                width: '90%', 
                height: isMobile ? '30px' : '80px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                px: isMobile ? 2 : 4,
                mb: isMobile ? 1 : 1,
                backgroundColor: '#f8f8f8',
                mx: 'auto',
              
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
                fontSize: isMobile ? '1rem' : '1.5rem', 
                mr: 1, 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                ค่าน้ำมัน
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: isMobile ? '1rem' : '2rem',  
                  fontWeight: 600, 
                  color: '#f44336',
                  ml: 'auto',
                  mr: 1,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {gasCostMin} - {gasCostMax}
              </Typography>
              <Typography sx={{ 
                fontSize: isMobile ? '0.8rem' : '2rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                /ต่อบาท**
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
                height: isMobile ? '30px' : '80px',
                borderRadius: 1,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: isMobile ? 1 : 4,
              }}
            >
              <Typography sx={{ 
                fontSize: isMobile ? '1.2rem' : '2.5rem',
                padding: '0 8px',
              }}>
                {kilometers} กิโลเมตร
              </Typography>
            </Box>

            {/* Reset Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 0,
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
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                width: '100%',
                px: 0, 
              }}>
                <Typography 
                  sx={{ 
                    fontSize: isMobile ? '0.4rem' : '0.8rem', 
                    fontWeight: 400, 
                    textAlign: 'center', 
                    lineHeight: 1.5, 
                    color: '#555',
                    mb: 2,
                  }}
                >
                  * คำนวณจาก ค่าไฟฟ้ามิเตอร์ TOU ช่วงเวลา Off-peak อัตราค่าไฟเดือนมีนาคม 2568 ค่าไฟฟ้าหน่วยละ 2.6037 บาท ค่า ft 0.3672 บาท (ยังไม่รวมค่าใช้จ่ายอื่น ๆ เช่น ค่าบริการมิเตอร์, การใช้จ่ายในการติดตั้งมิเตอร์ TOU, ภาษีมูลค่าเพิ่ม, ภาษีอื่นๆ เป็นต้น)  
                  โดยคำนวณจากการใช้อัตราสิ้นเปลือง 11 kWh/100 กิโลเมตร ถึง 20 kWh/100 กิโลเมตร ซึ่งอัตราการสิ้นเปลืองในการใช้งานจริงอาจแตกต่างกันไปขึ้นอยู่กับหลากหลายปัจจัย เช่น ความเร็ว อัตราเร่ง จำนวนน้ำหนักบรรทุกในรถ สไตล์การขับขี่แต่ละบุคคล อุณหภูมิ สภาวะแวดล้อมภายนอก เป็นต้น 
                  การคำนวณนี้เป็นการประมาณค่าพลังงานเบื้องต้นเท่านั้น การใช้งานจริงอาจมีค่าใช้จ่าย น้อยกว่าหรือมากกว่าตัวเลขด้านบน หรืออาจมีค่าใช้จ่ายอื่น ๆ เพิ่มเติมได้ 
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                width: '100%',
                px: 0, 
              }}>
                <Typography 
                  sx={{ 
                    fontSize: isMobile ? '0.4rem' : '0.8rem', 
                    fontWeight: 400, 
                    textAlign: 'center', 
                    lineHeight: 1.5, 
                    color: '#555',
                    mb: 2,
                  }}
                >
                  ** คำนวณจาก ค่าน้ำมันแก๊สโซฮอลล์ 91 ราคา 34.28 บาท ณ วันที่ 22 มีนาคม 2568 (ยังไม่รวมค่าใช้จ่าย อื่นๆ ถ้าหากมี เช่น ค่าบริการ เป็นต้น) 
โดยคำนวณจากการใช้อัตราสิ้นเปลือง 11 กิโลเมตร / 1 ลิตร ถึง 20 กิโลเมตร / 1 ลิตร ซึ่งอัตราการสิ้นเปลืองในการใช้งานจริงอาจแตกต่างกันไป ซึ่งอาจน้อยกว่าหรือมากกว่า 11 กิโลเมตร / 1 ลิตร ถึง 20 กิโลเมตร / 1 ลิตร ขึ้นอยู่กับหลากหลายปัจจัย เช่น อัตราการสิ้นเปลืองเฉพาะตัวของรถยนต์ในแต่ละรุ่น ขนาดของเครื่องยนต์ ความเร็ว อัตราเร่ง จำนวนน้ำหนักบรรทุกในรถ สไตล์การขับขี่แต่ละบุคคล อุณหภูมิ สภาวะแวดล้อมภายนอก เป็นต้น 
การคำนวณนี้เป็นการประมาณค่าพลังงานเบื้องต้นเท่านั้น การใช้งานจริงอาจมีค่าใช้จ่าย น้อยกว่าหรือมากกว่าตัวเลขด้านบน หรืออาจมีค่าใช้จ่ายอื่น ๆ เพิ่มเติมได้ 
                  </Typography>
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
                fontSize: isMobile ? '1rem' : '3rem',
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
                mt: isMobile ? 0 : 0,
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