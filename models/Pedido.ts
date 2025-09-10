import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "@/services/db";

// 1. Definição da interface de atributos para tipagem
interface PedidoAttributes {
  id: number;
  idLoja: number | null;
  idFornecedor: number;
  idTipoFretePedido: number;
  dataCompra: string;
  dataEntrega: string | null;
  valorTotal: string;
  idSituacaoPedido: number;
  observacao: string | null;
  desconto: string;
  idComprador: number | null;
  idDivisaoFornecedor: number | null;
  idPreCotacaoFornecedor: number | null;
  valorDesconto: string;
  idTipoAtendidoPedido: number;
  liberadoDivergenciaComprador: boolean | null;
  liberadoDivergenciaFornecedor: boolean | null;
  liberadoDivergenciaMercadologico: boolean | null;
}

// 2. Usa sequelize.define() para criar o modelo.
// A tipagem 'Optional' é aplicada diretamente no define.
const Pedido = sequelize.define<Model<PedidoAttributes, Optional<PedidoAttributes, "id">>, Optional<PedidoAttributes, "id">>('Pedido', {
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
  idTipoAtendidoPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tipoatendidopedido'
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

export { Pedido };