import React from 'react';
import styled from 'styled-components';
import { FaBell, FaUserCircle } from 'react-icons/fa';

export const NotificationIcon: React.FC<{ lit: boolean }> = ({ lit }) => (
  <Wrap>
    <FaBell />
    <Dot $lit={lit} />
  </Wrap>
);

export const AvatarIcon: React.FC<{ photo?: string }> = ({ photo }) =>
  photo ? <Photo src={photo} alt="" /> : <FaUserCircle />;

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const Dot = styled.span<{ $lit: boolean }>`
  position: absolute;
  top: -1px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme, $lit }) =>
    $lit ? theme.colors.quaternary : theme.colors.gray};
`;

const Photo = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.white};
`;
