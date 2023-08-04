import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genitore } from "./Genitore";

@Index("FKqocciwddsirp5vlslx47cf7jr", ["idGenitore"], {})
@Entity("figlio", { schema: "public" })
export class Figlio {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "codice", unique: true, length: 255 })
  codice: string;

  @Column("timestamp with time zone", {
    name: "create_at",
    default: () => "now()",
  })
  createAt: Date;

  @ManyToOne(() => Genitore, (genitore) => genitore.figlio, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "id_genitore", referencedColumnName: "id" }])
  idGenitore: Genitore;
}
