import {Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";
import { v4 } from "uuid";

@Table({
    tableName: "comment", timestamps: false
})

export class Comment extends Model {
    @Column({primaryKey: true, type:DataType.UUID})
    declare comment_id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
      })
    declare user_Id: string;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        allowNull: false
      })
    declare post_Id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare comment: string;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
      })
      declare likeComment: boolean;

}