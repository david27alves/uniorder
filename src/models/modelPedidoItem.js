import { DataTypes } from 'sequelize';
import sequelize from '../services/db.js';

  const PedidoItem = sequelize.define('PedidoItem', {
    // Definindo as colunas da tabela
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_loja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Exemplo de associação:
      // references: {
      //   model: 'Loja', // Nome da tabela ou model associada
      //   key: 'id',
      // },
      // onDelete: 'NO ACTION', // Corresponde a ON DELETE NO ACTION
      // onUpdate: 'NO ACTION', // Corresponde a ON UPDATE NO ACTION
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Exemplo de associação:
      // references: {
      //   model: 'Pedido',
      //   key: 'id',
      // },
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Exemplo de associação:
      // references: {
      //   model: 'Produto',
      //   key: 'id',
      // },
    },
    quantidade: {
      type: DataTypes.DECIMAL(12, 3), // NUMERIC(12,3)
      allowNull: false,
    },
    qtdembalagem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    custocompra: {
      type: DataTypes.DECIMAL(13, 4), // NUMERIC(13,4)
      allowNull: false,
    },
    dataentrega: {
      type: DataTypes.DATEONLY, // DATE
      allowNull: false,
    },
    desconto: {
      type: DataTypes.DECIMAL(11, 2), // NUMERIC(11,2)
      allowNull: false,
    },
    valortotal: {
      type: DataTypes.DECIMAL(11, 2), // NUMERIC(11,2)
      allowNull: false,
    },
    quantidadeatendida: {
      type: DataTypes.DECIMAL(12, 3), // NUMERIC(12,3)
      allowNull: false,
    },
    id_tipopedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Exemplo de associação:
      // references: {
      //   model: 'TipoPedido',
      //   key: 'id',
      // },
    },
    custofinal: {
      type: DataTypes.DECIMAL(13, 4), // NUMERIC(13,4)
      allowNull: false,
      defaultValue: 0,
    },
    id_tipoatendidopedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Exemplo de associação:
      // references: {
      //   model: 'TipoAtendidoPedido',
      //   key: 'id',
      // },
    },
  }, {
    // Opções da model
    tableName: 'pedidoitem', // Nome da tabela no banco de dados
    timestamps: false,     // Desabilita as colunas `createdAt` e `updatedAt`
    underscored: true,     // Usa snake_case para nomes de colunas geradas automaticamente (ex: foreign keys)
    uniqueKeys: {
      // Define a restrição de unicidade composta
      un_pedidoitem: {
        fields: ['id_loja', 'id_pedido', 'id_produto', 'id_tipopedido', 'dataentrega'],
      },
    },
  });

  // Definição das associações (relacionamentos)
  PedidoItem.associate = (models) => {
    // Um PedidoItem pertence a uma Loja
    PedidoItem.belongsTo(models.Loja, {
      foreignKey: 'id_loja',
      as: 'loja',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    // Um PedidoItem pertence a um Pedido
    PedidoItem.belongsTo(models.Pedido, {
      foreignKey: 'id_pedido',
      as: 'pedido',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    // Um PedidoItem pertence a um Produto
    PedidoItem.belongsTo(models.Produto, {
      foreignKey: 'id_produto',
      as: 'produto',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    // Um PedidoItem pertence a um TipoAtendidoPedido
    PedidoItem.belongsTo(models.TipoAtendidoPedido, {
      foreignKey: 'id_tipoatendidopedido',
      as: 'tipoAtendidoPedido',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    // Um PedidoItem pertence a um TipoPedido
    PedidoItem.belongsTo(models.TipoPedido, {
      foreignKey: 'id_tipopedido',
      as: 'tipoPedido',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  };


  export default PedidoItem