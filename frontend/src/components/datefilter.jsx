import React from 'react';
import { DatePicker, Space, message } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DateFilter = ({ onDateChange }) => {
  const defaultStart = dayjs('2020-03-01');
  const defaultEnd = dayjs('2020-07-01');

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        defaultValue={[defaultStart, defaultEnd]}
        format="YYYY-MM-DD"
        allowClear={false}
        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        onChange={(dates, dateStrings) => {
          if (!dates || dates.length !== 2 || !dateStrings[0] || !dateStrings[1]) {
            message.warning("Bitte ein vollständiges Start- und Enddatum auswählen.");
            return;
          }
          const [start, end] = dateStrings;
          onDateChange(start, end);
        }}
      />
    </Space>
  );
};

export default DateFilter;
