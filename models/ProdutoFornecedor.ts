import { DataTypes } from 'sequelize'
import sequelize from '@/services/db';

const ProdutoFornecedor = sequelize.define('ProdutoFornecedor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_fornecedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    custotabela: {
      type: DataTypes.DECIMAL(13, 4),
      allowNull: false,
    },
    codigoexterno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    qtdembalagem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_divisaofornecedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataalteracao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    desconto: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    tipoipi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ipi: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    tipobonificacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bonificacao: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    tipoverba: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    verba: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    custoinicial: {
      type: DataTypes.DECIMAL(13, 4),
      allowNull: false,
    },
    tipodesconto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pesoembalagem: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    id_tipopiscofins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    csosn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fatorembalagem: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    id_aliquotacredito: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    excecao: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    substituicaoestadual: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    valorsubstituicaoestadual: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
  }, {
    tableName: 'produtofornecedor',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['id_produto', 'id_fornecedor', 'id_estado'],
      },
    ],
  });

export default ProdutoFornecedor;