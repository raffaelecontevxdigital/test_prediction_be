import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("parola", { schema: "public" })
export class Parola {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", { name: "combination", default: true })
  combination: string;

  @Column("character varying", { name: "nome", unique: true, length: 255 })
  nome: string;

  @Column("numeric", { name: "rank" })
  rank: number;
}
