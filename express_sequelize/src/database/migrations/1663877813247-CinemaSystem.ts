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
    // Create show_rooms tables, primaryKey:id
    await queryInterface.createTable('show_rooms', {
      id: {
        type: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      allSeats: DataTypes.JSON,
      premiumSeats:  DataTypes.JSON,
      premiumStrategy: DataTypes.JSON,
    });
    await queryInterface.addIndex('show_rooms',
      ['id'],
    );
    // Create movies tables, primaryKey:id
    await queryInterface.createTable('movies', {
      id: {
        type: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      showTime: DataTypes.DATE,
      during: DataTypes.INTEGER,
      name: DataTypes.STRING,
      poster: DataTypes.STRING,
      trailer: DataTypes.STRING,
      publishTime: DataTypes.DATE,
      likes: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      area: DataTypes.STRING,
      languages: DataTypes.JSON,
    });
    await queryInterface.addIndex(
      'movies',
      ['id'],
    );

    // Create members enum using binary to caculate: {1000: admin, 0001: nomarl, 0010: VIP, 0100: superVIP}, primaryKey:id
    await queryInterface.createTable('members', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
      },
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      expireTime: DataTypes.DATE
    });
    await queryInterface.addIndex( 'members',
      ['id'],
    );

    // Create users tables, primaryKey:id; foreignKey: moviesList, memberId;
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      name: DataTypes.STRING,
      memberId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'members',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: true
      },
    });
    queryInterface.addIndex( 'users',
      ['id'],
    );

    // Create booked_records tables, primaryKey:id
    await queryInterface.createTable('booked_records', {
      id: {
        type: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      isRmoved: DataTypes.BOOLEAN,
      userId: {
        type: DataTypes.UUIDV4,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: true
      },
      movie: {
        type: DataTypes.UUIDV4,
        references: {
          model: {
            tableName: 'movies',
            schema: 'schema'
          },
          key: 'id'
        },
      },
    });
    await queryInterface.addIndex( 'booked_records',
      ['id'],
    );
    // Create arrange_show_records tables, primaryKey:id
    await queryInterface.createTable('arrange_show_records', {
      id: {
        type: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      isRmoved: DataTypes.BOOLEAN,
      userId: {
        type: DataTypes.UUIDV4,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
      movie: {
        type: DataTypes.UUIDV4,
        references: {
          model: {
            tableName: 'movies',
            schema: 'schema'
          },
          key: 'id'
        },
      },
      show_room: {
        type: DataTypes.UUIDV4,
        references: {
          model: {
            tableName: 'show_rooms',
            schema: 'schema'
          },
          key: 'id'
        },
      }
    });
    await queryInterface.addIndex( 'arrange_show_records',
      ['id'],
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface: QueryInterface) => {
    // todo 
    // await queryInterface.dropTable('show_rooms');
    // await queryInterface.dropTable('movies');
    // await queryInterface.dropTable('members');
    // await queryInterface.dropTable('users');
    // await queryInterface.dropTable('booked_records');
    // await queryInterface.dropTable('arrange_show_records');
    // await queryInterface.dropTable('UserStory');
  },
};
