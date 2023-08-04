import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";

@Index("UK_3hd86i9j8n79wg04do7lw1bi2", ["username"], { unique: true })
@Entity("operatore", { schema: "public" })
export class Operatore {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "mail", unique: true })
  mail: string;

  @Column("character varying", { name: "password" })
  password: string;

  @Column("character varying", { name: "username", unique: true })
  username: string;
  
  @Column("character varying", { name: "otp", nullable: true })
  otp: string;

  @Column("character varying", { name: "role" })
  role: number;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

}
