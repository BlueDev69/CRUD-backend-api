module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define(
    "products",
    {
      name: {
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING,
      },
      price: {
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

  return Products;
};
