import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Figlio } from "./Figlio";
import { Segnalazione } from "./Segnalazione";
import { Guasto } from "./Guasto";

@Index("UK_ctpytwrjxrb6pwu7sh11qlwm", ["codice"], { unique: true })
@Entity("genitore", { schema: "public" })
export class Genitore {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "codice", unique: true, length: 255 })
  codice: string;

  @Column("timestamp with time zone", {
    name: "create_at",
    default: () => "now()",
  })
  createAt: Date;

  @OneToMany(() => Figlio, (figlio) => figlio.idGenitore)
  figlio: Figlio[];

  @OneToMany(() => Segnalazione, (segnalazione) => segnalazione.idGenitore)
  segnalazione: Segnalazione[];
 
  @OneToMany(() => Guasto, (guasto) => guasto.idGenitore)
  guasto: Guasto[];
}
