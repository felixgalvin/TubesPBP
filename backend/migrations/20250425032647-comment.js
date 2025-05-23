"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comment", {
      comment_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user", // pastikan nama tabel sesuai
          key: "user_Id",
        },
        onDelete: "CASCADE",
      },
      post_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "post", // pastikan nama tabel sesuai
          key: "post_Id",
        },
        onDelete: "CASCADE",
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      likeComment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comment");
  },
};
