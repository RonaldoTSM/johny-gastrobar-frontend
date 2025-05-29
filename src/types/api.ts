
// Tipos baseados na API REST do Johny GastroBar - Atualizado para discriminated unions

interface FuncionarioBase {
  id?: number;
  nome: string;
  cpf: string;
  salario: number;
  dataContratacao: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  idSupervisor?: number | null;
  nomeSupervisor?: string | null;
  telefones: string[];
  dependentes: Dependente[];
}

export interface Garcom extends FuncionarioBase {
  tipo: "Garcom";
  setorAtendimento: string;
}

export interface Cozinheiro extends FuncionarioBase {
  tipo: "Cozinheiro";
  especialidadeCulinaria: string;
}

export interface Bartender extends FuncionarioBase {
  tipo: "Bartender";
  especialidadeBar: string;
}

export interface Gerente extends FuncionarioBase {
  tipo: "Gerente";
  nivelAcesso: string;
  limiteDesconto: number;
}

// Tipo União Discriminada - substitui a interface Funcionario anterior
export type Funcionario = Garcom | Cozinheiro | Bartender | Gerente;

export interface Dependente {
  nomeDependente: string;
  dataNascimento: string;
  parentesco: string;
}

export interface Item {
  idItem?: number;
  nome: string;
  tipo: 'Bebida' | 'Prato Principal' | 'Entrada' | 'Sobremesa' | 'Petisco' | 'Outro';
  preco: number;
}

export interface Mesa {
  idMesa?: number;
  capacidade: number;
  localizacao: string;
}

export interface Reserva {
  idReserva?: number;
  nomeResponsavel: string;
  numeroPessoas: number;
  idMesa: number;
  dataReserva: string;
  horaReserva: string;
  observacao?: string;
}

export interface ItemDoPedido {
  idItem: number;
  quantidade: number;
  nomeItem?: string;
  tipoItem?: string;
  precoUnitario?: number;
}

export interface Pedido {
  idPedido?: number;
  idGarcom?: number | null;
  idGerente?: number | null;
  idMesa: number;
  dataHora?: string;
  entregue?: boolean;
  pago?: boolean;
  desconto?: number;
  itensDoPedido: ItemDoPedido[];
}

export interface Pagamento {
  idPagamento?: number;
  idPedido: number;
  valorTotal: number;
  metodoPagamento: string;
  dataPagamento?: string;
}

export interface Autoriza {
  idAutorizacao?: number;
  idPedido: number;
  idGerente: number;
  dataAutorizacao?: string;
  observacaoAutorizacao?: string;
}

export interface FeedbackPedido {
  idFeedback?: number;
  idPedido: number;
  idMesa: number;
  nomeClienteFeedback?: string;
  notaComida?: number;
  notaAtendimento?: number;
  comentarioTexto?: string;
  dataFeedback?: string;
}
