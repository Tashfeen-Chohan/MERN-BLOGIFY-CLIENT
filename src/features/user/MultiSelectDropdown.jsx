import React, { useState } from 'react';

const MultiSelectDropdown = () => {
  // State to keep track of selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Options for the dropdown
  const options = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
  ];

  // Event handler for when an option is selected
  const handleSelectChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selectedValues);
  };

  return (
    <div className='mt-20'>
      <label>Select Multiple Options:</label>
      <select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div>
        <strong>Selected Options:</strong>
        <ul>
          {selectedOptions.map((selectedOption, index) => (
            <li key={index}>{selectedOption}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
