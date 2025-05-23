import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Reply } from "./Reply";

@Table({
    tableName: "likes",
    timestamps: false,
})
export class Like extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID
    })
    declare like_Id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare user_Id: string;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare post_Id: string;

    @ForeignKey(() => Comment)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare comment_Id: string;

    @ForeignKey(() => Reply)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare reply_Id: string;
}
