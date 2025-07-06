import React from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Tooltip,
} from '@mui/material';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 220,
    },
  },
};

const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl
      sx={{
        m: 0.5,
        minWidth: 140,
        maxWidth: 220,
      }}
      size="small"
    >
      <InputLabel 
        sx={{ 
          fontSize: "0.8rem",
          color: 'var(--dark-mode) ? #f3f4f6 : #374151',
          '&.Mui-focused': {
            color: 'var(--dark-mode) ? #60a5fa : #3b82f6',
          }
        }}
      >
        {label}
      </InputLabel>
      <Tooltip title={selectedValues.join(', ')} arrow>
        <Select
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={
            <OutlinedInput
              label={label}
              sx={{ 
                fontSize: "0.8rem", 
                height: "38px",
                backgroundColor: 'var(--dark-mode) ? #374151 : #ffffff',
                color: 'var(--dark-mode) ? #f3f4f6 : #374151',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--dark-mode) ? #6b7280 : #d1d5db',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--dark-mode) ? #9ca3af : #9ca3af',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--dark-mode) ? #60a5fa : #3b82f6',
                }
              }}
            />
          }
          renderValue={(selected) =>
            selected.length > 3
              ? `${selected.slice(0, 3).join(', ')}... +${selected.length - 3}`
              : selected.join(', ')
          }
          MenuProps={MenuProps}
          sx={{
            fontSize: "0.8rem",
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            '& .MuiSelect-icon': {
              color: 'var(--dark-mode) ? #9ca3af : #6b7280',
            }
          }}
        >
          {options.map((value) => (
            <MenuItem 
              key={value} 
              value={value} 
              dense
              sx={{
                backgroundColor: 'var(--dark-mode) ? #374151 : #ffffff',
                color: 'var(--dark-mode) ? #f3f4f6 : #374151',
                '&:hover': {
                  backgroundColor: 'var(--dark-mode) ? #4b5563 : #f3f4f6',
                }
              }}
            >
              <Checkbox
                checked={selectedValues.includes(value)}
                size="small"
                sx={{
                  color: 'var(--dark-mode) ? #9ca3af : #6b7280',
                  '&.Mui-checked': {
                    color: 'var(--dark-mode) ? #60a5fa : #3b82f6',
                  }
                }}
              />
              <ListItemText 
                primary={value} 
                sx={{ 
                  fontSize: "0.8rem",
                  color: 'var(--dark-mode) ? #f3f4f6 : #374151',
                }} 
              />
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </FormControl>
  );
};

export default MultiSelectFilter;
