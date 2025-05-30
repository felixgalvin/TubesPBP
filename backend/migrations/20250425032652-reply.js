"use strict";

/** @type {import('sequelize-cli').Migration} */
export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reply", {
      reply_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user", // pastikan sesuai nama tabel user
          key: "user_Id",
        },
        onDelete: "CASCADE",
      },
      post_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "post", // pastikan sesuai nama tabel post
          key: "post_Id",
        },
        onDelete: "CASCADE",
      },
      comment_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comment", // pastikan sesuai nama tabel comment
          key: "comment_Id",
        },
        onDelete: "CASCADE",
      },
      commentReply: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      likeReply: {
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
    await queryInterface.dropTable("reply");
  },
};
