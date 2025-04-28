import {Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { v4 } from "uuid";

@Table({
    tableName: "post", timestamps: false
})

export class Post extends Model {
    @Column({primaryKey: true, type:DataType.UUID})
    declare post_id: string;

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
        type: DataType.BOOLEAN,
        allowNull: false,
      })
      declare like: boolean;
      

      @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare topik: string;

}