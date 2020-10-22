import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity()
export class TeacherStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher)
  @JoinColumn()
  teacher: string;

  @ManyToOne(() => Student)
  @JoinColumn()
  student: string;
}
