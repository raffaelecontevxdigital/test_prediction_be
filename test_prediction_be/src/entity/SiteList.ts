import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("siteList", { schema: "public" })
export class SiteList {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("character varying", {
        name: "url",
        length: 150,
        unique: true
    })
    url: string;

    @Column("boolean", { name: "status", default: true })
    status: boolean;

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

    @Column("timestamp with time zone", {
        name: "deleted_at",
        nullable: true
    })
    deletedAt: Date;

}
