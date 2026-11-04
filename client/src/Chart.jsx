import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Chart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/order/last14days');
        const result = await response.json();

        if (result.success) {
          // Format lại ngày cho đẹp nếu cần (tuỳ chọn)
          const formattedData = result.data.revenuelist14Days.map(item => ({
            ...item,
            // Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM
            displayDate: new Date(item.date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit'
            })
          }));
          setData(formattedData);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data. Ensure your backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Lỗi: {error}</div>;
  }

  return (
    <div style={{ width: '100%', height: 400, padding: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Doanh thu 14 ngày qua</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toFixed(2)}`, 'Doanh thu']}
            labelFormatter={(label) => `Ngày: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            name="Doanh thu" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;