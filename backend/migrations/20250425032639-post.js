"use strict";

/** @type {import('sequelize-cli').Migration} */
export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post", {
      post_Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      user_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user", 
          key: "user_Id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      post: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      likePost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
      },
      topik: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post");
  },
};
