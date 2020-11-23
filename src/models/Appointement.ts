import { v4 as uuid } from 'uuid';

class Appoitment {
  id: string;

  provider: string;

  date: Date;

  constructor({ provider, date }: Omit<Appoitment, 'id'>){
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appoitment;
