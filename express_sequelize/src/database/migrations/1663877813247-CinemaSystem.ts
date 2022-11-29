import { QueryInterface, DataTypes } from 'sequelize';

export default {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I don't want to configure the seating for every show
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'User',
        'MovieId',
        {
          type: DataTypes.UUIDV4,
          references: {
            model: {
              tableName: 'movie',
            },
            key: 'id'
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'User',
        'AdministrationId',
        {
          type: DataTypes.UUIDV4,
          references: {
            model: {
              tableName: 'administration',
            },
            key: 'id'
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'User',
        'PricingId',
        {
          type: DataTypes.UUIDV4,
          references: {
            model: {
              tableName: 'pricing',
            },
            key: 'id'
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'User',
        'Seating',
        {
          type: DataTypes.JSON,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'User',
        'UserId',
        {
          type: DataTypes.UUIDV4,
          unique: true,
          primaryKey: true,
        },
        { transaction }
      );
      await queryInterface.addIndex(
        'User',
        ['UserId'],
        {
          unique: true,
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('User', 'petName', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
