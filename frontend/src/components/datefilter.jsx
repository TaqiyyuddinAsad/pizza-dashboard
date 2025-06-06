import React from 'react';

import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
const DateFilter = () => (
  <Space direction="vertical" size={12}>
    <RangePicker
      id={{
        start: 'startInput',
        end: 'endInput',
      }}
      onFocus={(_, info) => {
        console.log('Focus:', info.range);
      }}
      onBlur={(_, info) => {
        console.log('Blur:', info.range);
      }}
    />
  </Space>
);
export default DateFilter;