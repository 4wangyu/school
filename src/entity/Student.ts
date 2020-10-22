import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryColumn()
  email: string;

  @Column()
  suspended: boolean;

  constructor(email: string, suspended: boolean) {
    this.email = email;
    this.suspended = suspended;
  }
}
