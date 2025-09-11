import React, { useState } from 'react';
import styled, { css } from 'styled-components';

interface Option {
  icon: React.ReactNode;
  hint: string;
  action: () => void;
  disabled?: boolean;
}

interface FloatingButtonProps {
  mainButtonIcon: React.ReactNode;
  mainButtonHint?: string;
  mainAction?: () => void;
  options?: Option[];
  disabled?: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ mainButtonIcon, mainButtonHint, mainAction, options, disabled }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const toggleOptions = (show: boolean) => {
    setShowOptions(show);
  };

  const handleOptionClick = (action: () => void) => {
    action();
    toggleOptions(false);
  };

  return (
    <FloatingButtonWrapper>
      <MainButton 
        onMouseEnter={() => toggleOptions(true)} 
        onMouseLeave={() => toggleOptions(false)}
        title={mainButtonHint}
        onClick={mainAction}
        disabled={disabled}
      >
        {mainButtonIcon}
      </MainButton>

      {options && showOptions && (
        <OptionsContainer onMouseEnter={() => toggleOptions(true)} onMouseLeave={() => toggleOptions(false)}>
          {options.map((option, index) => (
            <OptionCircle key={index} onClick={() => handleOptionClick(option.action)} title={option.hint} disabled={option.disabled}>
              {option.icon}
            </OptionCircle>
          ))}
        </OptionsContainer>
      )}
    </FloatingButtonWrapper>
  );
};

export default FloatingButton;

export const FloatingButtonWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const commonButtonStyles = css`
  color: white;
  background-color: ${props => props.theme.colors.tertiary};
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

export const MainButton = styled.button`
  ${commonButtonStyles};
  width: 55px;
  height: 55px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.3' : '1')};
`;

export const OptionsContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0;
  width: 55px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export const OptionCircle = styled.button`
  ${commonButtonStyles};
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.3' : '1')};

  &:last-child {
    margin-bottom: 20px;
  }
`;
