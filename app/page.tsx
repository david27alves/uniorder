'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Definição das Interfaces (Tipagem)
interface IProduto {
  COD_PRODUTO: string;
  DESCRICAO: string;
  EMBALAGEM: string;
  QTDPEDIDA: string;
  PESOTOTAL: string;
  PRC_VENDA_UNIT: string;
  TOTAL: string;
}

interface IPedido {
  NUMERO_PEDIDO: string;
  LOTE: string;
  EMPRESA: string;
  COD_CLIENTE: string;
  CLIENTE: string;
  PRODUTOS: IProduto[];
  TOTAL_PEDIDO: string;
  STATUS: string;
  DTAINCLUSAO: string;
  VENCIMENTO: string;
  FORMABASTEC: string;
  CATEGORIA: string;
}

// Lógica de processamento de dados do lado do cliente
const processFileData = (fileContent: string): IPedido[] => {
  const lines = fileContent.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('O arquivo está vazio.');
  }

  const predefinedHeaders = [
    'NUMERO_PEDIDO', 'LOTE', 'EMPRESA', 'COD_CLIENTE', 'CLIENTE',
    'COD_PRODUTO', 'DESCRICAO', 'EMBALAGEM', 'QTDPEDIDA', 'PESOTOTAL',
    'PRC_VENDA_UNIT', 'TOTAL', 'STATUS', 'DTAINCLUSAO', 'VENCIMENTO',
    'FORMABASTEC', 'CATEGORIA',
  ];

  let hasHeader = false;
  const firstLine = lines[0].trim().replace(/\r/g, '');
  const firstLineHeaders = firstLine.split(';');

  if (firstLineHeaders.length === predefinedHeaders.length) {
    hasHeader = firstLineHeaders.every((header, index) =>
      header.trim() === predefinedHeaders[index].trim()
    );
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;

  const ordersMap = new Map<string, IPedido>();

  dataLines.forEach((line) => {
    if (!line.trim()) return;

    const values = line.split(';');
    if (values.length !== predefinedHeaders.length) {
      console.warn(`Aviso: Linha ignorada devido a número incorreto de colunas: ${line}`);
      return;
    }

    const rowData: { [key: string]: string } = {};
    predefinedHeaders.forEach((header, index) => {
      rowData[header] = values[index].trim();
    });

    try {
      const {
        NUMERO_PEDIDO, LOTE, EMPRESA, COD_CLIENTE, CLIENTE,
        STATUS, DTAINCLUSAO, VENCIMENTO, FORMABASTEC, CATEGORIA,
        ...produtoData
      } = rowData;

      const produto: IProduto = {
        COD_PRODUTO: produtoData.COD_PRODUTO,
        DESCRICAO: produtoData.DESCRICAO,
        EMBALAGEM: produtoData.EMBALAGEM,
        QTDPEDIDA: produtoData.QTDPEDIDA,
        PESOTOTAL: produtoData.PESOTOTAL,
        PRC_VENDA_UNIT: produtoData.PRC_VENDA_UNIT,
        TOTAL: produtoData.TOTAL,
      };

      if (ordersMap.has(NUMERO_PEDIDO)) {
        const existingOrder = ordersMap.get(NUMERO_PEDIDO)!;
        existingOrder.PRODUTOS.push(produto);
        const totalPedido = existingOrder.PRODUTOS.reduce((acc, prod) => {
          const total = parseFloat(prod.TOTAL.replace(',', '.'));
          return acc + total;
        }, 0);
        existingOrder.TOTAL_PEDIDO = totalPedido.toFixed(2).replace('.', ',');
      } else {
        const totalPedido = parseFloat(produto.TOTAL.replace(',', '.'));
        const newOrder: IPedido = {
          NUMERO_PEDIDO,
          LOTE,
          EMPRESA,
          COD_CLIENTE,
          CLIENTE,
          PRODUTOS: [produto],
          TOTAL_PEDIDO: totalPedido.toFixed(2).replace('.', ','),
          STATUS,
          DTAINCLUSAO,
          VENCIMENTO,
          FORMABASTEC,
          CATEGORIA,
        };
        ordersMap.set(NUMERO_PEDIDO, newOrder);
      }
    } catch (e) {
      console.log(e)
      throw new Error(`Erro ao processar a linha: ${line}`);
    }
  });

  return Array.from(ordersMap.values());
};

function Row(props: { row: IPedido }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.NUMERO_PEDIDO}</TableCell>
        <TableCell>{row.CLIENTE}</TableCell>
        <TableCell>{row.EMPRESA}</TableCell>
        <TableCell align="right">R$ {row.TOTAL_PEDIDO}</TableCell>
        <TableCell>{row.STATUS}</TableCell>
        <TableCell>{row.DTAINCLUSAO}</TableCell>
        <TableCell>{row.CATEGORIA}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table size="small" aria-label="produtos">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Embalagem</TableCell>
                    <TableCell align="right">Qtd.</TableCell>
                    <TableCell align="right">Preço Unitário</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.PRODUTOS.map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {produto.COD_PRODUTO}
                      </TableCell>
                      <TableCell>{produto.DESCRICAO}</TableCell>
                      <TableCell>{produto.EMBALAGEM}</TableCell>
                      <TableCell align="right">{produto.QTDPEDIDA}</TableCell>
                      <TableCell align="right">R$ {produto.PRC_VENDA_UNIT}</TableCell>
                      <TableCell align="right">R$ {produto.TOTAL}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pedidosData, setPedidosData] = useState<IPedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      setError(null);
      setPedidosData([]);
      setApiResponse(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = e.target && e.target.result ? (e.target.result as string) : '';
          const result = processFileData(fileContent);
          setPedidosData(result);
        } catch (err: unknown) {
          setError((err as Error).message || 'Erro ao processar o arquivo. Verifique o formato dos dados.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    setIsSending(true);
    setApiResponse(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidosData),
      });

      // Sempre tenta ler a resposta, mesmo se o status não for 'ok'
      const result = await response.json();

      if (response.ok) {
        // Lógica de Sucesso
        const createdIds = Array.isArray(result) ? result.map((item) => item.id).join(', ') : '';
        setApiResponse({
          message: `Sucesso! Pedido(s) criado(s) com os IDs: ${createdIds}.`,
          severity: 'success'
        });
        
        setPedidosData([]);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } else {
        // Lógica de Erro: A API retornou um status de erro (ex: 400, 500)
        let errorMessage: string = 'Erro ao gravar os pedidos!';

        // Lógica para extrair a mensagem de erro da resposta
        if (result && typeof result === 'object') {
            if (result.error) {
                // Se o erro for um objeto, tenta extrair a mensagem dele
                if (typeof result.error === 'object' && result.error.message) {
                    errorMessage = result.error.message;
                } else if (typeof result.error === 'string') {
                    errorMessage = result.error;
                }
            } else if (result.message) {
                // Se a mensagem de erro estiver em uma propriedade 'message'
                errorMessage = result.message;
            } else if (result.errors) {
                // Se a API retornar um array de erros
                if (Array.isArray(result.errors) && result.errors.length > 0) {
                    errorMessage = `Erros de validação: ${result.errors.join(', ')}`;
                }
            } else if (result.name && result.level) {
                // Se a API retornar um objeto de log (como no seu erro original)
                errorMessage = `Falha na API: ${result.name} - ${JSON.stringify(result.errors)}`;
            } else {
                // Fallback genérico para o objeto de erro
                errorMessage = `Erro: ${JSON.stringify(result)}`;
            }
        }

        setApiResponse({ 
          message: errorMessage, 
          severity: 'error' 
        });
      }
    } catch (e: unknown) {
      // Lógica para falhas de rede ou comunicação (o fetch falhou)
      console.error('Falha na comunicação:', e);
      setApiResponse({ message: `Falha na comunicação com o servidor: ${(e as Error).message}`, severity: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    return pedidosData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [pedidosData, page, rowsPerPage]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 4, border: '1px solid #ddd', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Importação de Pedidos
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            color="primary"
          >
            {file ? `Arquivo: ${file.name}` : 'Selecionar Arquivo'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".csv,text/plain"
              ref={fileInputRef}
            />
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={pedidosData.length === 0 || isSending}
            startIcon={isSending ? null : <SendIcon />}
            color="success"
          >
            {isSending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Enviar Dados para API'}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        {loading && <CircularProgress size={24} />}
        {error && (
          <Alert severity="error" sx={{ width: '100%', maxWidth: 'sm' }}>
            {error}
          </Alert>
        )}
        {apiResponse && (
          <Alert severity={apiResponse.severity} sx={{ width: '100%', maxWidth: 'sm' }}>
            {apiResponse.message}
          </Alert>
        )}
      </Box>

      {pedidosData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Visualização de Dados
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            <Table aria-label="collapsible table" sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ fontWeight: 'bold' }}>Nº Pedido</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Empresa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data Inclusão</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((pedido) => (
                  <Row key={pedido.NUMERO_PEDIDO} row={pedido} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: pedidosData.length }]}
            component="div"
            count={pedidosData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Box>
      )}
    </Container>
  );
}