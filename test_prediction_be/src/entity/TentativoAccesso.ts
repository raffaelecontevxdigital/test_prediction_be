import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("tentativo_accesso", { schema: "public" })
export class TentativoAccesso {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "url",
    length: 150
  })
  url: string;

  @Column("character varying", {
    name: "hostname",
    length: 150,
    nullable: true
  })
  hostname: string;

  @Column("character varying", {
    name: "host",
    length: 150,
    nullable: true
  })
  host: string;

  @Column("character varying", {
    name: "pathname",
    length: 150,
    nullable: true
  })
  pathname: string;

  @Column("character varying", {
    name: "port",
    length: 150,
    nullable: true
  })
  port: string;

  @Column("character varying", {
    name: "protocol",
    length: 150,
    nullable: true
  })
  protocol: string;

  @Column("timestamp with time zone", {
    name: "create_at",
    default: () => "now()",
  })
  createAt: Date;

}
