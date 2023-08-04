import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("time_consuming_op", { schema: "public" })
export class TimeConsumingOp {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "controller", length: 50 })
  controller: string;

  @Column("character varying", { name: "command", length: 50 })
  command: string;

  @Column("timestamp without time zone", {
    name: "date",
    default: () => "now()",
  })
  date: Date;

  @Column("json", { name: "status" })
  status: any;

}
