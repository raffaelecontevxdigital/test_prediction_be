import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genitore } from "./Genitore";

@Index("FK68k4dpf95eixwc74awp7md9os", ["idGenitore"], {})
@Entity("segnalazione", { schema: "public" })
export class Segnalazione {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "url",
    length: 150
  })
  url: string;

  @Column("character varying", { name: "status", nullable: true, length: 255 })
  status: string;

  @Column("character varying", { name: "nota_operatore", nullable: true, length: 255 })
  notaOperatore: string;

  @Column("timestamp with time zone", {
    name: "create_at",
    default: () => "now()",
  })
  createAt: Date;

  @Column("timestamp with time zone", {
    name: "update_at",
    default: () => "now()",
  })
  updateAt: Date;

  @Column("numeric", { name: "id_operatoreUpdater", nullable: true })
  idOperatoreUpdater: string;

  @ManyToOne(() => Genitore, (genitore) => genitore.segnalazione)
  @JoinColumn([{ name: "id_genitore", referencedColumnName: "id" }])
  idGenitore: Genitore;
}
