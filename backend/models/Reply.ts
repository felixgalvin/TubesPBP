import {Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { v4 } from "uuid";

@Table({
    tableName: "reply", timestamps: false
})

export class Reply extends Model {
    @Column({primaryKey: true, type:DataType.UUID})
    declare reply_id: string;

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

    @ForeignKey(() => Comment)
    @Column({
        type: DataType.UUID,
        allowNull: false
      })
    declare comment_Id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare commentReply: string;
    
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
      })
      declare likeReply: number;

}