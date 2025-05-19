import styled from '@emotion/styled';
import React from 'react';

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${props => props.checked ? '#0070f3' : '#fff'};
  border: 2px solid ${props => props.checked ? '#0070f3' : '#ddd'};
  border-radius: 4px;
  transition: all 150ms;
  position: relative;

  &:hover {
    border-color: ${props => props.checked ? '#0070f3' : '#999'};
  }

  &::after {
    content: '';
    position: absolute;
    display: ${props => props.checked ? 'block' : 'none'};
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const Label = styled.span`
  font-size: 14px;
  color: #333;
`;

interface CheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: React.ReactNode;
}

const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <StyledCheckbox checked={checked} />
      <Label>{label}</Label>
    </CheckboxContainer>
  );
};

export default Checkbox; 