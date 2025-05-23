import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { Comment } from "./Comment";
import { Reply } from "./Reply";
import { v4 } from "uuid";

@Table({
    tableName: "post", timestamps: false
})

export class Post extends Model {
    @Column({ primaryKey: true, type: DataType.UUID })
    declare post_Id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare user_Id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare post: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare likePost: number;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare topik: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;
}