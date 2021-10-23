module.exports = (sequelize, Sequelize) => {
  const Stocks = sequelize.define(
    "stocks",
    {
      product_id: {
        type: Sequelize.INTEGER,
      },
      stock_count: {
        type: Sequelize.INTEGER,
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

  return Stocks;
};
