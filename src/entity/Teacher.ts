import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryColumn()
  email: string;
}
