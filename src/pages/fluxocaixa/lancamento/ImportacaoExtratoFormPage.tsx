import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import {
  ActionButton,
  Container,
  DragDropFile,
  FieldValue,
  formatDateToYMDString,
  isDateValid,
  Loading,
  Stack,
  useMessage,
} from 'lcano-react-ui';
import { useAuth, useParametro } from '../../../contexts';
import { ExtratoFluxoCaixaService } from '../../../service';
import {
  getDescricaoTipoExtrato,
  tipoExtratoOptions,
  TipoExtratoEnum,
} from '../../../types';

const ImportacaoExtratoFormPage: React.FC = () => {
  const { usuario } = useAuth();
  const { parametros } = useParametro();
  const message = useMessage();

  const [tipoExtrato, setTipoExtrato] = useState<TipoExtratoEnum>('CONTA_CORRENTE');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [dropzoneKey, setDropzoneKey] = useState(0);

  const buildDataVencimentoPadrao = (): Date => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), parametros.diaPadraoVencimentoCartao);
  };

  const handleReset = () => {
    setArquivo(null);
    setDataVencimento(tipoExtrato === 'FATURA_CARTAO' ? buildDataVencimentoPadrao() : undefined);
    setDropzoneKey(k => k + 1);
  };

  const handleImportar = async () => {
    if (!usuario?.token || !arquivo) {
      message.showError('Selecione um arquivo CSV para importar.');
      return;
    }

    setIsUploading(true);

    let result;
    if (tipoExtrato === 'CONTA_CORRENTE') {
      result = await ExtratoFluxoCaixaService.importarContaCorrente(usuario.token, arquivo, message);
    } else if (tipoExtrato === 'FATURA_CARTAO') {
      const dvStr = dataVencimento ? formatDateToYMDString(dataVencimento) : undefined;
      result = await ExtratoFluxoCaixaService.importarFaturaCartao(usuario.token, arquivo, dvStr, message);
    } else {
      result = await ExtratoFluxoCaixaService.importarMovimentacaoB3(usuario.token, arquivo, message);
    }

    setIsUploading(false);

    if (result) {
      message.showSuccess('Importação iniciada. Você será notificado quando concluir.');
      handleReset();
    }
  };

  const handleTipoChange = (value: unknown) => {
    const tipo = String(value) as TipoExtratoEnum;
    setTipoExtrato(tipo);
    setDataVencimento(tipo === 'FATURA_CARTAO' ? buildDataVencimentoPadrao() : undefined);
  };

  const isRequiredFieldsFilled = (): boolean => {
      if (tipoExtrato === 'FATURA_CARTAO') {
        return !!arquivo && isDateValid(dataVencimento);
      }
  
      return !!arquivo;
    };

  return (
    <Container>
      <Loading isLoading={isUploading} />
      <ActionButton
        icon={<FaUpload />}
        hint="Importar"
        onClick={handleImportar}
        disabled={isUploading || !isRequiredFieldsFilled()}
      />
      <Stack direction="column" divider="top">
        <Stack direction="row" divider="x">
          <FieldValue
            description="Tipo de Extrato"
            type="SELECT"
            value={{ key: tipoExtrato, value: getDescricaoTipoExtrato(tipoExtrato) }}
            editable
            options={tipoExtratoOptions}
            onUpdate={handleTipoChange}
          />
          {tipoExtrato === 'FATURA_CARTAO' && (
            <FieldValue
              description="Data Vencimento"
              type="DATE"
              value={dataVencimento ? formatDateToYMDString(dataVencimento) : ''}
              editable
              onUpdate={(value) => {
                if (value instanceof Date) setDataVencimento(value);
              }}
            />
          )}
        </Stack>
        <DragDropFile
          key={dropzoneKey}
          onFileChange={setArquivo}
          acceptedFileFormats={['text/csv']}
        />
      </Stack>
    </Container>
  );
};

export default ImportacaoExtratoFormPage;
