import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";
import { Reply } from "./Reply";
import { v4 } from "uuid";

@Table({
  tableName: "comment", timestamps: false
})

export class Comment extends Model {
  @Column({ primaryKey: true, type: DataType.UUID })
  declare comment_Id: string;

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare likeComment: number;

  @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;
}