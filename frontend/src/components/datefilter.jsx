import React from 'react';
import { DatePicker, Space, message } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DateFilter = ({ onDateChange }) => {
  const defaultStart = dayjs('2020-01-01');
  const defaultEnd = dayjs('2020-02-01');

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        defaultValue={[defaultStart, defaultEnd]}
        format="YYYY-MM-DD"
        allowClear={false}
        className="dark-datefilter"
        popupClassName="dark-datefilter-popup"
        style={{
          width: '240px',
          minWidth: '200px',
          maxWidth: '260px',
        }}
        size="small"
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

export default React.memo(DateFilter);
