"use strict";

/** @type {import('sequelize-cli').Migration} */
export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reply", {
      reply_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user", // pastikan sesuai nama tabel user
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      post_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "post", // pastikan sesuai nama tabel post
          key: "post_id",
        },
        onDelete: "CASCADE",
      },
      comment_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comment", // pastikan sesuai nama tabel comment
          key: "comment_id",
        },
        onDelete: "CASCADE",
      },
      commentReply: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      likeReply: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reply");
  },
};
