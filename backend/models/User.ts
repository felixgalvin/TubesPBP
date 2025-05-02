import {Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { Sequelize } from "sequelize-typescript";

export type StatusGender = "male" | "Female";

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
        type: DataType.STRING,
        allowNull: false,
    })
    declare gender: StatusGender;

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
}

export const findUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Find user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };