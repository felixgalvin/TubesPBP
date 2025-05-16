    import {Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
    import { User } from "./User";
    import { Comment } from "./Comment";
    import { Reply } from "./Reply";
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
            type: DataType.INTEGER,
            allowNull: false,
        })
        declare like: number;
        

        @Column({
            type: DataType.STRING,
            allowNull: false,
        })
        declare topik: string;

        @HasMany(() => Comment)
        declare comments: Comment[];

        @HasMany(() => Reply)
        declare replies: Reply[];
    }