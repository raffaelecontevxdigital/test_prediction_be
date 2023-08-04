import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genitore } from "./Genitore";

@Entity("guasto", { schema: "public" })
export class Guasto {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", {
    name: "data",
    default: () => "now()",
  })
  data: Date;

  @Column("character varying", { name: "reason", nullable: true, length: 255 })
  reason: string;
  
  @Column("character varying", { name: "descrizione", nullable: true, length: 255 })
  descrizione: string;

  @Column("character varying", { name: "nota_operatore", nullable: true, length: 255 })
  notaOperatore: string;

  @Column("character varying", { name: "status", nullable: true, length: 255 })
  status: string;

  @Column("timestamp with time zone", {
    name: "update_at",
    default: () => "now()",
  })
  updateAt: Date;

  @Column("numeric", { name: "id_operatoreUpdater", nullable: true })
  idOperatoreUpdater: string;

  @ManyToOne(() => Genitore, (genitore) => genitore.guasto, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "id_genitore", referencedColumnName: "id" }])
  idGenitore: Genitore;

}
