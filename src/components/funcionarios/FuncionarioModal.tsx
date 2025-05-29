import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { funcionarioService } from '@/services/funcionarioService';
import { Funcionario, Dependente } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface FuncionarioModalProps {
  open: boolean;
  onClose: () => void;
  funcionario?: Funcionario | null;
}

export function FuncionarioModal({ open, onClose, funcionario }: FuncionarioModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!funcionario;

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    salario: '',
    dataContratacao: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    idSupervisor: '',
    tipoFuncionario: 'Garcom' as 'Garcom' | 'Cozinheiro' | 'Bartender' | 'Gerente',
    setorAtendimento: '',
    especialidadeCulinaria: '',
    especialidadeBar: '',
    nivelAcesso: '',
    limiteDesconto: '',
  });

  const [telefones, setTelefones] = useState<string[]>(['']);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);

  // Buscar supervisores para o select
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: funcionarioService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: funcionarioService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast({
        title: "Sucesso",
        description: "Funcionário criado com sucesso!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar funcionário.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Funcionario> }) => 
      funcionarioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast({
        title: "Sucesso",
        description: "Funcionário atualizado com sucesso!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar funcionário.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        salario: funcionario.salario.toString(),
        dataContratacao: funcionario.dataContratacao,
        rua: funcionario.rua,
        numero: funcionario.numero,
        bairro: funcionario.bairro,
        cidade: funcionario.cidade,
        estado: funcionario.estado,
        cep: funcionario.cep,
        idSupervisor: funcionario.idSupervisor?.toString() || 'sem-supervisor',
        tipoFuncionario: funcionario.tipo,
        setorAtendimento: funcionario.tipo === 'Garcom' ? funcionario.setorAtendimento : '',
        especialidadeCulinaria: funcionario.tipo === 'Cozinheiro' ? funcionario.especialidadeCulinaria : '',
        especialidadeBar: funcionario.tipo === 'Bartender' ? funcionario.especialidadeBar : '',
        nivelAcesso: funcionario.tipo === 'Gerente' ? funcionario.nivelAcesso : '',
        limiteDesconto: funcionario.tipo === 'Gerente' ? funcionario.limiteDesconto.toString() : '',
      });
      setTelefones(funcionario.telefones.length > 0 ? funcionario.telefones : ['']);
      setDependentes(funcionario.dependentes || []);
    } else {
      resetForm();
    }
  }, [funcionario, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseData = {
      nome: formData.nome,
      cpf: formData.cpf,
      salario: parseFloat(formData.salario),
      dataContratacao: formData.dataContratacao,
      rua: formData.rua,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      idSupervisor: formData.idSupervisor === 'sem-supervisor' ? null : parseInt(formData.idSupervisor),
      telefones: telefones.filter(tel => tel.trim() !== ''),
      dependentes,
      tipo: formData.tipoFuncionario, // Campo que o backend espera
    };

    let finalData: any = { ...baseData };

    // Adicionar campos específicos baseado no tipo
    switch (formData.tipoFuncionario) {
      case 'Garcom':
        finalData.setorAtendimento = formData.setorAtendimento;
        break;
      case 'Cozinheiro':
        finalData.especialidadeCulinaria = formData.especialidadeCulinaria;
        break;
      case 'Bartender':
        finalData.especialidadeBar = formData.especialidadeBar;
        break;
      case 'Gerente':
        finalData.nivelAcesso = formData.nivelAcesso;
        finalData.limiteDesconto = parseFloat(formData.limiteDesconto);
        break;
    }

    console.log('Dados enviados para o backend:', finalData);

    if (isEditing) {
      updateMutation.mutate({ id: funcionario.id!, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const addTelefone = () => {
    setTelefones([...telefones, '']);
  };

  const removeTelefone = (index: number) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const updateTelefone = (index: number, value: string) => {
    const newTelefones = [...telefones];
    newTelefones[index] = value;
    setTelefones(newTelefones);
  };

  const addDependente = () => {
    setDependentes([...dependentes, { nomeDependente: '', dataNascimento: '', parentesco: '' }]);
  };

  const removeDependente = (index: number) => {
    setDependentes(dependentes.filter((_, i) => i !== index));
  };

  const updateDependente = (index: number, field: keyof Dependente, value: string) => {
    const newDependentes = [...dependentes];
    newDependentes[index] = { ...newDependentes[index], [field]: value };
    setDependentes(newDependentes);
  };

  const resetForm = () => {
    setFormData({
      nome: '', cpf: '', salario: '', dataContratacao: '', rua: '', numero: '',
      bairro: '', cidade: '', estado: '', cep: '', idSupervisor: 'sem-supervisor',
      tipoFuncionario: 'Garcom', setorAtendimento: '', 
      especialidadeCulinaria: '', especialidadeBar: '', nivelAcesso: '', limiteDesconto: '',
    });
    setTelefones(['']);
    setDependentes([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salario">Salário</Label>
                <Input
                  id="salario"
                  type="number"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataContratacao">Data de Contratação</Label>
                <Input
                  id="dataContratacao"
                  type="date"
                  value={formData.dataContratacao}
                  onChange={(e) => setFormData({ ...formData, dataContratacao: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.rua}
                  onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Tipo e especialização */}
          <Card>
            <CardHeader>
              <CardTitle>Função e Especialização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoFuncionario">Tipo de Funcionário</Label>
                  <Select value={formData.tipoFuncionario} onValueChange={(value: any) => setFormData({ ...formData, tipoFuncionario: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Garcom">Garçom</SelectItem>
                      <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                      <SelectItem value="Bartender">Bartender</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select value={formData.idSupervisor} onValueChange={(value) => setFormData({ ...formData, idSupervisor: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem-supervisor">Nenhum</SelectItem>
                      {funcionarios.map((func) => (
                        <SelectItem key={func.id} value={func.id!.toString()}>
                          {func.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Campos específicos por tipo */}
              {formData.tipoFuncionario === 'Garcom' && (
                <div>
                  <Label htmlFor="setorAtendimento">Setor de Atendimento</Label>
                  <Input
                    id="setorAtendimento"
                    value={formData.setorAtendimento}
                    onChange={(e) => setFormData({ ...formData, setorAtendimento: e.target.value })}
                    required
                  />
                </div>
              )}

              {formData.tipoFuncionario === 'Cozinheiro' && (
                <div>
                  <Label htmlFor="especialidadeCulinaria">Especialidade Culinária</Label>
                  <Input
                    id="especialidadeCulinaria"
                    value={formData.especialidadeCulinaria}
                    onChange={(e) => setFormData({ ...formData, especialidadeCulinaria: e.target.value })}
                    required
                  />
                </div>
              )}

              {formData.tipoFuncionario === 'Bartender' && (
                <div>
                  <Label htmlFor="especialidadeBar">Especialidade do Bar</Label>
                  <Input
                    id="especialidadeBar"
                    value={formData.especialidadeBar}
                    onChange={(e) => setFormData({ ...formData, especialidadeBar: e.target.value })}
                    required
                  />
                </div>
              )}

              {formData.tipoFuncionario === 'Gerente' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nivelAcesso">Nível de Acesso</Label>
                    <Input
                      id="nivelAcesso"
                      value={formData.nivelAcesso}
                      onChange={(e) => setFormData({ ...formData, nivelAcesso: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="limiteDesconto">Limite de Desconto (%)</Label>
                    <Input
                      id="limiteDesconto"
                      type="number"
                      step="0.01"
                      value={formData.limiteDesconto}
                      onChange={(e) => setFormData({ ...formData, limiteDesconto: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Telefones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Telefones
                <Button type="button" variant="outline" size="sm" onClick={addTelefone}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {telefones.map((telefone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={telefone}
                    onChange={(e) => updateTelefone(index, e.target.value)}
                    placeholder="Telefone"
                  />
                  {telefones.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTelefone(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dependentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Dependentes
                <Button type="button" variant="outline" size="sm" onClick={addDependente}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dependentes.map((dependente, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-end">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={dependente.nomeDependente}
                      onChange={(e) => updateDependente(index, 'nomeDependente', e.target.value)}
                      placeholder="Nome do dependente"
                    />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={dependente.dataNascimento}
                      onChange={(e) => updateDependente(index, 'dataNascimento', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Parentesco</Label>
                    <Input
                      value={dependente.parentesco}
                      onChange={(e) => updateDependente(index, 'parentesco', e.target.value)}
                      placeholder="Ex: Filho(a), Cônjuge"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDependente(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
