import React, { useState, useEffect, useMemo } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { debounce } from 'lodash';

const SearchableSelect = ({
  label,
  options = [],
  value,
  onChange,
  loading = false,
  onSearch,
  getOptionLabel,
  renderOption,
  placeholder = 'Search...',
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      if (onSearch && searchTerm.length > 0) {
        setIsLoading(true);
        onSearch(searchTerm).finally(() => setIsLoading(false));
      }
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    if (inputValue) {
      debouncedSearch(inputValue);
    }
  }, [inputValue, debouncedSearch]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={loading || isLoading}
      disabled={disabled}
      noOptionsText={inputValue ? 'No results found' : 'Start typing to search...'}
      loadingText="Searching..."
      clearOnBlur={false}
      selectOnFocus
      handleHomeEndKeys
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading || isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchableSelect;

