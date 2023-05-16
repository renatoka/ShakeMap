import { ColouringServiceProps } from '../interfaces/interfaces.types';

export const Colouring = ({ magnitude }: ColouringServiceProps) => {
  // colors taken from https://www.vectorstock.com/royalty-free-vector/earthquake-magnitude-scale-vector-20714182
  switch (true) {
    case magnitude >= 0 && magnitude < 1:
      return 'lightgreen';
    case magnitude >= 1 && magnitude < 2:
      return '#79ab4a';
    case magnitude >= 2 && magnitude < 3:
      return '#c0d731';
    case magnitude >= 3 && magnitude < 4:
      return '#ffc20f';
    case magnitude >= 4 && magnitude < 5:
      return '#f7941f';
    case magnitude >= 5 && magnitude < 6:
      return '#f46f2c';
    case magnitude >= 6 && magnitude < 7:
      return '#f0452b';
    case magnitude >= 7 && magnitude < 8:
      return '#ea1c29';
    case magnitude >= 8 && magnitude < 9:
      return '#d6186e';
    case magnitude >= 9:
      return '#d6186e';
  }
};
