import styled from '@emotion/styled';
import React from 'react';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

const CheckboxContainer = styled.label`
  /* Layout */
  display: flex;
  align-items: center;
  gap: ${spacing[2]};

  /* Others */
  cursor: pointer;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  /* Layout */
  position: absolute;

  /* Box Model */
  height: 0;
  width: 0;

  /* Visual */
  opacity: 0;

  /* Others */
  cursor: pointer;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  /* Layout */
  display: inline-block;
  position: relative;

  /* Box Model */
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.checked ? colors.primary[600] : colors.gray[300]};
  border-radius: ${spacing[1]};

  /* Visual */
  background: ${props => props.checked ? colors.primary[600] : colors.background.default};

  /* Others */
  transition: all 150ms;

  &:hover {
    border-color: ${props => props.checked ? colors.primary[600] : colors.gray[400]};
  }

  &::after {
    /* Layout */
    position: absolute;
    display: ${props => props.checked ? 'block' : 'none'};
    left: 6px;
    top: 2px;

    /* Box Model */
    width: 5px;
    height: 10px;
    border: solid ${colors.background.default};
    border-width: 0 2px 2px 0;

    /* Others */
    content: '';
    transform: rotate(45deg);
  }
`;

const Label = styled.span`
  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
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