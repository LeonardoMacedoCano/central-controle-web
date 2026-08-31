import React from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';

export const NotificationIcon: React.FC<{ lit: boolean }> = ({ lit }) => (
  <Wrap>
    <FaBell />
    <Dot $lit={lit} />
  </Wrap>
);

export const AvatarIcon: React.FC<{ src: string }> = ({ src }) => (
  <Avatar src={src} alt="" />
);

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const Dot = styled.span<{ $lit: boolean }>`
  position: absolute;
  top: -2px;
  right: -3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, $lit }) =>
    $lit ? theme.colors.quaternary : theme.colors.gray};
`;

const Avatar = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;
