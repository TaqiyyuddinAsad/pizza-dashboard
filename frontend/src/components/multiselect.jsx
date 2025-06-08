import React from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from '@mui/material';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
  return (
    <FormControl
      sx={{
        m: 0.5,
        minWidth: 140,
      }}
      size="small"
    >
      <InputLabel sx={{ fontSize: "0.8rem" }}>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={(e) =>
          onChange(typeof e.target.value === 'string'
            ? e.target.value.split(',')
            : e.target.value)
        }
        input={
          <OutlinedInput
            label={label}
            sx={{ fontSize: "0.8rem", height: "38px" }}
          />
        }
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
        sx={{ fontSize: "0.8rem" }}
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
    </FormControl>
  );
};

export default MultiSelectFilter;
