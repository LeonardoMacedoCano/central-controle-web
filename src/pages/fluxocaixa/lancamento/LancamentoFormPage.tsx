import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { Despesa, initialDespesaState } from '../../../types/fluxocaixa/Despesa';
import AtivoSectionForm from './AtivoSectionForm';
import { Lancamento } from '../../../types/fluxocaixa/Lancamento';
import { ActionButton, Container, FieldValue, formatDateToYMDString, formatIsoDateToBrDate, getCurrentDate, isDateValid, Stack, useMessage } from 'lcano-react-ui';
import { AuthContext } from '../../../contexts';
import { LancamentoService } from '../../../service';
import { Ativo, getCodigoTipoMovimento, getDescricaoTipoMovimento, getTipoMovimentoByCodigo, initialAtivoState, initialRendaState, Renda, tipoMovimentoOptions } from '../../../types';
import DespesaSectionForm from './DespesaSection';
import RendaSectionForm from './RendaSectionForm';

const LancamentoFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [lancamento, setLancamento] = useState<Lancamento>({
    id: 0,
    dataLancamento: getCurrentDate(),
    descricao: ""
  });

  const auth = useContext(AuthContext);
  const message = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = auth.usuario?.token;

    if (!id || !token) return;

    const fetchData = async () => {
      try {
        const result = await LancamentoService.getLancamento(token, id);
        if (result) setLancamento(result);
      } catch (error) {
        message.showErrorWithLog(
          'Erro ao carregar o lançamento.',
          error
        );
      }
    };

    fetchData();
  }, [auth.usuario?.token, id, message]);

  const update = (updatedFields: Partial<Lancamento>) => {
    setLancamento(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const handleUpdateTipo = (value: any) => {
    const selectedTipo = getTipoMovimentoByCodigo(String(value));
    update({
      tipo: selectedTipo,
      itemDTO: undefined
    });
  };

  const handleUpdateDescricao = (value: any) => {
    if (typeof value === 'string') {
      update({ descricao: value });
    }
  };

  const handleUpdateItem = (value: any) => {
    update({ itemDTO: value });
  };

  const isRequiredFieldsFilled = (): boolean => {
    if (!lancamento.descricao.trim() || !lancamento.tipo || !lancamento.itemDTO)
      return false;

    const { tipo, itemDTO } = lancamento;

    if (tipo === 'DESPESA') {
      const despesa = itemDTO as Despesa;
      return (
        !!despesa.categoria &&
        !!despesa.formaPagamento &&
        despesa.valor > 0 &&
        isDateValid(despesa.dataVencimento)
      );
    }

    if (tipo === 'RENDA') {
      const renda = itemDTO as Renda;
      return !!renda.categoria && renda.valor > 0;
    }

    if (tipo === 'ATIVO') {
      const ativo = itemDTO as Ativo;
      return (
        !!ativo.categoria &&
        !!ativo.operacao &&
        ativo.valor > 0 &&
        isDateValid(ativo.dataMovimento)
      );
    }

    return false;
  };

  const saveLancamento = async () => {
    if (!auth.usuario?.token) return;

    try {
      const response = await LancamentoService.saveLancamento(
        auth.usuario.token,
        lancamento
      );

      if (response?.id) {
        navigate(`/lancamento/${response.id}`);
      }
    } catch (error) {
      message.showErrorWithLog('Erro ao salvar o lançamento.', error);
    }
  };

  const renderLancamentoSection = () => {
    if (!lancamento?.tipo) return null;

    switch (lancamento.tipo) {
      case 'ATIVO':
        return (
          <AtivoSectionForm
            ativo={(lancamento.itemDTO as Ativo) || initialAtivoState}
            onUpdate={handleUpdateItem}
          />
        );
       
      case 'DESPESA':
        return (
          <DespesaSectionForm
            despesa={(lancamento.itemDTO as Despesa) || initialDespesaState}
            onUpdate={handleUpdateItem}
          />
        );
        
      case 'RENDA':
        return (
          <RendaSectionForm
            renda={(lancamento.itemDTO as Renda) || initialRendaState}
            onUpdate={handleUpdateItem}
          />
        );  

      default:
        return null;
    }
  };

  return (
    <Container>
      <ActionButton
        icon={<FaCheck />}
        hint="Salvar"
        onClick={saveLancamento}
        disabled={!isRequiredFieldsFilled()}
      />

      <Stack direction="column" divider="top">
        <FieldValue
          description="Descrição"
          type="STRING"
          value={lancamento.descricao}
          editable
          onUpdate={handleUpdateDescricao}
        />
        <Stack direction="row" divider="x">
          <FieldValue
            description="Data Lançamento"
            type="STRING"
            value={
              formatIsoDateToBrDate(
                formatDateToYMDString(lancamento.dataLancamento)
              )
            }
            editable={false}
          />
          <FieldValue
            description="Tipo"
            type="SELECT"
            value={{
              key: getCodigoTipoMovimento(lancamento.tipo),
              value: getDescricaoTipoMovimento(lancamento.tipo)
            }}
            editable
            options={tipoMovimentoOptions}
            onUpdate={handleUpdateTipo}
          />
        </Stack>
        
        {renderLancamentoSection()}
      </Stack>
    </Container>
  );
};

export default LancamentoFormPage;
