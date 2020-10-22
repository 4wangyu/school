import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity()
export class TeacherStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, { nullable: false })
  teacher: string;

  @ManyToOne(() => Student, { nullable: false })
  student: string;
}
