import {Table, Column, Model, DataType, PrimaryKey, HasMany  } from "sequelize-typescript";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Reply } from "./Reply";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { Sequelize } from "sequelize-typescript";

@Table({
    tableName: "user", timestamps: false
})

export class User extends Model {
    @Column({
        primaryKey: true, 
        type:DataType.UUID
    })
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare username: string;
    
    @Column({
        type: DataType.ENUM("MALE", "FEMALE"),
        allowNull: false,
    })
    declare gender: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
      })
      declare profileImage: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;

    @HasMany(() => Post)
    declare posts: Post[];

    @HasMany(() => Comment)
    declare comments: Comment[];

    @HasMany(() => Reply)
    declare replies: Reply[];
}
