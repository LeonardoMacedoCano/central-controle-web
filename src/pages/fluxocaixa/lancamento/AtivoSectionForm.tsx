import React, { useContext } from 'react';
import { Ativo, getCodigoTipoOperacaoExtratoMovimentacaoB3, getDescricaoTipoOperacaoExtratoMovimentacaoB3, getTipoOperacaoExtratoMovimentacaoB3ByCodigo, MovimentacaoCategoria, tipoOperacaoExtratoMovimentacaoB3Options } from '../../../types';
import {
  buildSearchSelectAdapter,
  FieldValue,
  formatDateToYMDString,
  SearchSelectField,
  Stack
} from 'lcano-react-ui';
import { MovimentacaoCategoriaService } from '../../../service';
import { AuthContext } from '../../../contexts';

interface AtivoSectionFormProps {
  ativo: Ativo;
  onUpdate: (updatedAtivo: Ativo) => void;
}

const AtivoSectionForm: React.FC<AtivoSectionFormProps> = ({ ativo, onUpdate }) => {
  const { usuario } = useContext(AuthContext);

  const updateAtivo = (updatedFields: Partial<Ativo>) => {
    onUpdate({
      ...ativo,
      ...updatedFields
    });
  };

  const handleUpdateDataMovimento = (value: Date) => {
    if (value instanceof Date) {
      updateAtivo({ dataMovimento: value });
    }
  };

  const handleUpdateValor = (value: any) => {
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      updateAtivo({ valor: numericValue });
    }
  };

  const handleUpdateOperacao = (value: any) => {
    const selectedOperacao =
      getTipoOperacaoExtratoMovimentacaoB3ByCodigo(value);
    updateAtivo({ operacao: selectedOperacao });
  };

  const { fetchOptions, onSelect, optionValue } =
    buildSearchSelectAdapter<MovimentacaoCategoria>({
      searchOptions: async (query, page, pageSize) => {
        const response = await MovimentacaoCategoriaService.getCategorias(
          usuario!.token,
          page,
          pageSize,
          `tipo==ATIVO;descricao=ilike='${query}'`
        );
        return response?.content || [];
      },
      mapToOption: (c) => ({
        key: String(c.id),
        value: c.descricao
      }),
      mapFromOption: (opt) => ({
        id: Number(opt.key),
        descricao: opt.value,
        tipo: 'ATIVO'
      }),
      value: ativo.categoria,
      onUpdate: (newValue) => updateAtivo({ categoria: newValue })
    });

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Movimentação"
          type="DATE"
          value={formatDateToYMDString(ativo?.dataMovimento)}
          onUpdate={handleUpdateDataMovimento}
        />
        <FieldValue
          description="Operação"
          type="SELECT"
          value={{
            key: getCodigoTipoOperacaoExtratoMovimentacaoB3(ativo?.operacao),
            value: getDescricaoTipoOperacaoExtratoMovimentacaoB3(ativo?.operacao)
          }}
          editable
          options={tipoOperacaoExtratoMovimentacaoB3Options}
          onUpdate={handleUpdateOperacao}
        />
      </Stack>
      <Stack direction="row" divider="x">
          <SearchSelectField
          label="Categoria"
          fetchOptions={fetchOptions}
          value={optionValue}
          onSelect={onSelect}
        /> 
        <FieldValue
          description="Valor"
          type="NUMBER"
          value={ativo.valor}
          editable
          minValue={0}
          onUpdate={handleUpdateValor}
        />
      </Stack>
    </Stack>
  );
};

export default AtivoSectionForm;
