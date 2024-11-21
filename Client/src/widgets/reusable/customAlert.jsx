import React from 'react';
import styled, { keyframes } from 'styled-components';

export const CustomAlert = ({ visible, onClose, message, setRedirect }) => {
    const OnClickRTR = (redirect) => {
        onClose();
        setRedirect(redirect);
    };

    return (
        <AlertOverlay $visible={visible}>
            <p>{message}</p>
            <ButtonContainer>
                <AlertButton onClick={() => OnClickRTR(false)} disabled={!visible}>Cancel</AlertButton>
                <AlertButton onClick={() => OnClickRTR(true)} disabled={!visible}>OK</AlertButton>
            </ButtonContainer>
        </AlertOverlay>
    );
};

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 20px;
  left: 40%;
  transform: translateX(-50%);
  background-color: #32303a;
  color: #f1e6e6;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
  width: 300px;
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(-20px)')};
  transition: opacity 0.6s ease, transform 0.6s ease;
  animation: ${({ $visible }) => ($visible ? slideDown : '')} 0.6s ease;
  font-size: 19px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 25px;
  gap: 38%;
`;

const AlertButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 20px;
  cursor: pointer;
  &:disabled{
    cursor: default;
  }

  &:hover {
    background-color: #0056b3;
  }
`;
