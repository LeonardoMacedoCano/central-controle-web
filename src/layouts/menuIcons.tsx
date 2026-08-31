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
  <Avatar>
    <img src={src} alt="" />
  </Avatar>
);

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const Dot = styled.span<{ $lit: boolean }>`
  position: absolute;
  top: -1px;
  right: -3px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.black};
  background-color: ${({ theme, $lit }) =>
    $lit ? theme.colors.quaternary : theme.colors.gray};
`;

const Avatar = styled.span`
  display: inline-flex;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
