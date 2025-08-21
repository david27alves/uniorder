import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";

const Pedido = sequelize.define(
    'Pedido', 
    {
    // Primary Key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id' // Maps to the 'id' column in the database
    },
    // Foreign Key: id_loja (nullable)
    idLoja: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null as per SQL definition
      field: 'id_loja' // Maps to the 'id_loja' column
    },
    // Foreign Key: id_fornecedor (not null)
    idFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_fornecedor' // Maps to the 'id_fornecedor' column
    },
    // Foreign Key: id_tipofretepedido (not null)
    idTipoFretePedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipofretepedido' // Maps to the 'id_tipofretepedido' column
    },
    // Date of purchase (not null)
    dataCompra: {
      type: DataTypes.DATEONLY, // Using DATEONLY for 'date' type in PostgreSQL
      allowNull: false,
      field: 'datacompra' // Maps to the 'datacompra' column
    },
    // Delivery date (nullable)
    dataEntrega: {
      type: DataTypes.DATEONLY, // Using DATEONLY for 'date' type
      allowNull: true, // Can be null
      field: 'dataentrega' // Maps to the 'dataentrega' column
    },
    // Total value (not null, numeric(11,2))
    valorTotal: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'valortotal' // Maps to the 'valortotal' column
    },
    // Foreign Key: id_situacaopedido (not null)
    idSituacaoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_situacaopedido' // Maps to the 'id_situacaopedido' column
    },
    // Observation (nullable, character varying(1500))
    observacao: {
      type: DataTypes.STRING(1500),
      allowNull: true, // Can be null
      field: 'observacao' // Maps to the 'observacao' column
    },
    // Discount (not null, numeric(11,2))
    desconto: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'desconto' // Maps to the 'desconto' column
    },
    // Foreign Key: id_comprador (nullable)
    idComprador: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
      field: 'id_comprador' // Maps to the 'id_comprador' column
    },
    // Foreign Key: id_divisaofornecedor (nullable)
    idDivisaoFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
      field: 'id_divisaofornecedor' // Maps to the 'id_divisaofornecedor' column
    },
    // Foreign Key: id_precotacaofornecedor (nullable)
    idPreCotacaoFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
      field: 'id_precotacaofornecedor' // Maps to the 'id_precotacaofornecedor' column
    },
    // Discount value (not null, numeric(11,2))
    valorDesconto: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'valordesconto' // Maps to the 'valordesconto' column
    },
    // Email sent status (not null, boolean, default false)
    email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email' // Maps to the 'email' column
    },
    // Foreign Key: id_tipoatendidopedido (not null)
    idTipoAtendidoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipoatendidopedido' // Maps to the 'id_tipoatendidopedido' column
    },
    // Sent status (not null, boolean, default false)
    enviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'enviado' // Maps to the 'enviado' column
    },
    // Boolean for divergence approval by buyer (nullable)
    liberadoDivergenciaComprador: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Can be null
      field: 'liberadodivergenciacomprador' // Maps to the 'liberadodivergenciacomprador' column
    },
    // Boolean for divergence approval by supplier (nullable)
    liberadoDivergenciaFornecedor: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Can be null
      field: 'liberadodivergenciafornecedor' // Maps to the 'liberadodivergenciafornecedor' column
    },
    // Boolean for divergence approval by marketing (nullable)
    liberadoDivergenciaMercadologico: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Can be null
      field: 'liberadodivergenciamercadologico' // Maps to the 'liberadodivergenciamercadologico' column
    }
  }, {
    tableName: 'pedido', // Explicitly define the table name
    timestamps: false, // Assuming no 'createdAt' and 'updatedAt' columns in your SQL table
    freezeTableName: true // Prevents Sequelize from pluralizing the table name
  });

  // Define associations here (after all models are defined)
  // Example for a foreign key:
  // Pedido.associate = (models) => {
  //   Pedido.belongsTo(models.Comprador, {
  //     foreignKey: 'idComprador', // This is the camelCase attribute name in the model
  //     targetKey: 'id', // This is the primary key in the Comprador model
  //     as: 'comprador' // Alias for the association
  //   });
  //   Pedido.belongsTo(models.Fornecedor, {
  //     foreignKey: 'idFornecedor',
  //     targetKey: 'id',
  //     as: 'fornecedor'
  //   });
  //   // Add other associations similarly
  // };

  //return Pedido;

export default Pedido