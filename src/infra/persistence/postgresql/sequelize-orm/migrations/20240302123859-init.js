'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          phone: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          password_hash: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          roles: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction: t },
      );

      await queryInterface.createTable(
        'refresh_sessions',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          },
          refresh_token: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          expires_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('refresh_sessions', { transaction: t });
      await queryInterface.dropTable('users', { transaction: t });
    });
  },
};
