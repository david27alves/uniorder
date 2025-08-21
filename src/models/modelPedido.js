import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";

const Pedido = sequelize.define(
    'Pedido', 
    {
    
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id' 
    },
    
    idLoja: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      field: 'id_loja' 
    },
    
    idFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_fornecedor' 
    },
    
    idTipoFretePedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipofretepedido' 
    },
    
    dataCompra: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      field: 'datacompra' 
    },
    
    dataEntrega: {
      type: DataTypes.DATEONLY, 
      allowNull: true, 
      field: 'dataentrega' 
    },
    
    valorTotal: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'valortotal' 
    },
    
    idSituacaoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_situacaopedido' 
    },
    
    observacao: {
      type: DataTypes.STRING(1500),
      allowNull: true, 
      field: 'observacao' 
    },
   
    desconto: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'desconto' 
    },
    
    idComprador: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      field: 'id_comprador' 
    },
    
    idDivisaoFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      field: 'id_divisaofornecedor' 
    },
    
    idPreCotacaoFornecedor: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      field: 'id_precotacaofornecedor' 
    },
    
    valorDesconto: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
      field: 'valordesconto' 
    },
    
    email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email' 
    },
    
    idTipoAtendidoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipoatendidopedido' 
    },
    
    enviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'enviado' 
    },
    
    liberadoDivergenciaComprador: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
      field: 'liberadodivergenciacomprador' 
    },
    
    liberadoDivergenciaFornecedor: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
      field: 'liberadodivergenciafornecedor' 
    },
    
    liberadoDivergenciaMercadologico: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
      field: 'liberadodivergenciamercadologico' 
    }
  }, {
    tableName: 'pedido',
    timestamps: false, 
    freezeTableName: true 
  });


export default Pedido