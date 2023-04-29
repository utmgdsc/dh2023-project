import { UserRole, User as IUser } from "../types";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column("text", { array: true, default: [] })
  refresh_tokens: string[];

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true})
  mostRecentSubmission?: string;
}
