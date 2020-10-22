import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryColumn()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
