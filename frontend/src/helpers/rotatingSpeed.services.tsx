import { RotatingSpeedHelperProps } from '../interfaces/interfaces.types';

export const RotatingSpeed = ({ zoom }: RotatingSpeedHelperProps) => {
  switch (true) {
    case zoom >= 2 && zoom < 3:
      return 30;
    case zoom >= 3 && zoom < 4:
      return 25;
    case zoom >= 4 && zoom < 5:
      return 20;
    case zoom >= 5 && zoom < 6:
      return 15;
    case zoom >= 6 && zoom < 7:
      return 10;
    case zoom >= 7 && zoom < 8:
      return 8;
    case zoom >= 8 && zoom < 9:
      return 5;
    case zoom >= 9:
      return 2;
    default:
      return 35;
  }
};
