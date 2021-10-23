module.exports = (sequelize, Sequelize) => {
  const Customers = sequelize.define(
    "customers",
    {
      address_number: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      postal_code: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      created_at: {
        field: "created_at",
        type: Sequelize.DATE,
      },
      updated_at: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Customers;
};
