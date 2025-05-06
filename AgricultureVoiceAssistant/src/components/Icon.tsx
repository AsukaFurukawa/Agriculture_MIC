import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: string;
  size: number;
  color: string;
}

export const Icon = ({ name, size, color }: IconProps) => (
  <MaterialCommunityIcons name={name} size={size} color={color} />
); 