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
      <InputLabel sx={{ fontSize: "0.8rem" }}>{label}</InputLabel>
      <Tooltip title={selectedValues.join(', ')} arrow>
        <Select
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={
            <OutlinedInput
              label={label}
              sx={{ fontSize: "0.8rem", height: "38px" }}
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
          }}
        >
          {options.map((value) => (
            <MenuItem key={value} value={value} dense>
              <Checkbox
                checked={selectedValues.includes(value)}
                size="small"
              />
              <ListItemText primary={value} sx={{ fontSize: "0.8rem" }} />
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </FormControl>
  );
};

export default MultiSelectFilter;
