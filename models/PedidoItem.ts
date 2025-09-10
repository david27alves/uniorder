import { DataTypes } from 'sequelize';
import sequelize from '@/services/db';

  const PedidoItem = sequelize.define('PedidoItem', {
    
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_loja: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.DECIMAL(12, 3), 
      allowNull: false,
    },
    qtdembalagem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    custocompra: {
      type: DataTypes.DECIMAL(13, 4), 
      allowNull: false,
    },
    dataentrega: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    desconto: {
      type: DataTypes.DECIMAL(11, 2), 
      allowNull: false,
    },
    valortotal: {
      type: DataTypes.DECIMAL(11, 2), 
      allowNull: false,
    },
    quantidadeatendida: {
      type: DataTypes.DECIMAL(12, 3), 
      allowNull: false,
    },
    id_tipopedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    custofinal: {
      type: DataTypes.DECIMAL(13, 4),
      allowNull: false,
      defaultValue: 0,
    },
    id_tipoatendidopedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
  }, {

    tableName: 'pedidoitem',
    timestamps: false,
    underscored: true,
    // uniqueKeys: {

    //   un_pedidoitem: {
    //     fields: ['id_loja', 'id_pedido', 'id_produto', 'id_tipopedido', 'dataentrega'],
    //   },
    // },
  });


//   PedidoItem.associate = (models) => {

//     PedidoItem.belongsTo(models.Loja, {
//       foreignKey: 'id_loja',
//       as: 'loja',
//       onDelete: 'NO ACTION',
//       onUpdate: 'NO ACTION',
//     });


//     PedidoItem.belongsTo(models.Pedido, {
//       foreignKey: 'id_pedido',
//       as: 'pedido',
//       onDelete: 'NO ACTION',
//       onUpdate: 'NO ACTION',
//     });


//     PedidoItem.belongsTo(models.Produto, {
//       foreignKey: 'id_produto',
//       as: 'produto',
//       onDelete: 'NO ACTION',
//       onUpdate: 'NO ACTION',
//     });


//     PedidoItem.belongsTo(models.TipoAtendidoPedido, {
//       foreignKey: 'id_tipoatendidopedido',
//       as: 'tipoAtendidoPedido',
//       onDelete: 'NO ACTION',
//       onUpdate: 'NO ACTION',
//     });


//     PedidoItem.belongsTo(models.TipoPedido, {
//       foreignKey: 'id_tipopedido',
//       as: 'tipoPedido',
//       onDelete: 'NO ACTION',
//       onUpdate: 'NO ACTION',
//     });
//   };


  export default PedidoItem