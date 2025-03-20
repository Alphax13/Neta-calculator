import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Card,
  CardContent,
  Button,
  InputAdornment,
  Grid,
  Divider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// NETA V-II specifications
const BATTERY_CAPACITY = 38.54; // kWh
const DRIVING_RANGE = 380; // km
const CONSUMPTION_RATE = BATTERY_CAPACITY / DRIVING_RANGE; // kWh/km

function ChargingCalculator() {
  const navigate = useNavigate();
  const [dailyDistance, setDailyDistance] = useState(40);
  const [electricityRate, setElectricityRate] = useState(4.5);
  const [fuelPrice, setFuelPrice] = useState(35);
  const [fuelConsumption, setFuelConsumption] = useState(12);
  const [carModel, setCarModel] = useState('');

  // คำนวณค่าใช้จ่ายของรถ EV
  const dailyEnergyUsed = dailyDistance * CONSUMPTION_RATE;
  const dailyChargeCost = dailyEnergyUsed * electricityRate;
  const monthlyChargeCost = dailyChargeCost * 30;
  const yearlyChargeCost = monthlyChargeCost * 12;

  // คำนวณค่าใช้จ่ายของรถน้ำมัน
  const dailyFuelUsed = dailyDistance / 100 * fuelConsumption;
  const dailyFuelCost = dailyFuelUsed * fuelPrice;
  const monthlyFuelCost = dailyFuelCost * 30;
  const yearlyFuelCost = monthlyFuelCost * 12;

  // คำนวณการประหยัด
  const monthlySavings = monthlyFuelCost - monthlyChargeCost;
  const yearlySavings = yearlyFuelCost - yearlyChargeCost;

  const handleDistanceChange = (event, newValue) => {
    setDailyDistance(newValue);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleCarModelChange = (event) => {
    setCarModel(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url('/cal.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <img src="/neta-logo.png" alt="NETA Logo" style={{ height: '40px' }} />
      </Box>

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 500,
          color: '#333',
          mb: 4,
          textAlign: 'center',
        }}
      >
        คำนวณค่าใช้จ่ายการชาร์จรถ NETA
      </Typography>

      <Card elevation={3} sx={{ backgroundColor: '#fff', padding: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            เลือกรุ่นรถของคุณ
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>เลือกกลุ่มรถ</InputLabel>
            <Select
              value={carModel}
              label="เลือกกลุ่มรถ"
              onChange={handleCarModelChange}
            >
              <MenuItem value="NETA X - ELECTRIC SUV">NETA X - ELECTRIC SUV</MenuItem>
              <MenuItem value="Net V II Smart">Net V II Smart</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom>
            ข้อมูลการใช้รถ
          </Typography>

          <Typography id="distance-slider" gutterBottom>
            ระยะทางที่ขับต่อวัน: {dailyDistance} กม.
          </Typography>
          <Slider
            aria-labelledby="distance-slider"
            value={dailyDistance}
            onChange={handleDistanceChange}
            min={10}
            max={200}
            step={5}
            marks={[
              { value: 10, label: '10 กม.' },
              { value: 100, label: '100 กม.' },
              { value: 200, label: '200 กม.' },
            ]}
            sx={{ mb: 4 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ราคาค่าไฟต่อหน่วย"
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">บาท/kWh</InputAdornment>,
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ราคาน้ำมัน"
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">บาท/ลิตร</InputAdornment>,
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="อัตราการสิ้นเปลืองน้ำมันของรถยนต์ทั่วไป"
                type="number"
                value={fuelConsumption}
                onChange={(e) => setFuelConsumption(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ลิตร/100กม.</InputAdornment>,
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 28,
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              คำนวณค่าใช้จ่าย
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackClick}
          sx={{
            borderRadius: 28,
            px: 6,
            py: 1.5,
            fontSize: '1.2rem',
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          กลับหน้าหลัก
        </Button>
      </Box>
    </Box>
  );
}

export default ChargingCalculator;
