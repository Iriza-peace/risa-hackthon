import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { Box, Typography, Stack, Card, CardContent } from '@mui/material';

// Pie Chart Data
const data = [
  { name: 'Received', value: 471, color: '#0065E1' },
  { name: 'In Progress', value: 224, color: '#FFB201' },
  { name: 'Resolved', value: 305, color: '#17B355' }
];

export default function TicketsAnalytics() {
  return (
    <Card sx={{ backgroundColor: 'white', borderRadius: '4px' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Ticket Analytics
        </Typography>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Pie Chart Section */}
          <Box sx={{ width: '50%' }}>
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </Box>

          {/* Legend Section */}
          <Stack spacing={1} sx={{ width: '40%' }}>
            {data.map((item, index) => (
              <Typography
                key={index}
                variant="subtitle1"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    mr: 1,
                  }}
                />
                {item.name}
              </Typography>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
