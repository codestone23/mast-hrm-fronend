"use client";

import React from 'react';
import { LoadingContainer, Spinner, LoadingText } from './loadingStyle';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  $fullScreen?: boolean;
  $center?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  $fullScreen = false,
  $center = true,
}) => {
  return (
    <LoadingContainer $fullScreen={$fullScreen} $center={$center}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;

