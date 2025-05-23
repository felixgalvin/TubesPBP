"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("likes", {
      like_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
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
      post_Id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "post",
          key: "post_Id",
        },
        onDelete: "CASCADE",
      },
      comment_Id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "comment",
          key: "comment_Id",
        },
        onDelete: "CASCADE",
      },
      reply_Id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "reply",
          key: "reply_Id",
        },
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("likes");
  },
};
