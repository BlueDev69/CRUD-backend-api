module.exports = (sequelize, Sequelize) => {
  const CryptoOrders = sequelize.define(
    "crypto_order",
    {
      customer_id: {
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      cut_stock: {
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

  return CryptoOrders;
};
