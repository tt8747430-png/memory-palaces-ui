import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{ variant?: string }>`
  ${({ theme, variant = 'default' }) => {
    switch (variant) {
      case 'default':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.textOnPrimary};
          &:hover { opacity: 0.9; }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.textOnSecondary};
          &:hover { opacity: 0.9; }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.textOnPrimary};
          }
        `;
      default:
        return '';
    }
  }}
  
  font-family: ${({ theme }) => theme.typography.fontFamily.brand};
  padding: ${({ theme }) => theme.spacing.component.buttonPaddingY} ${({ theme }) => theme.spacing.component.buttonPaddingX};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
