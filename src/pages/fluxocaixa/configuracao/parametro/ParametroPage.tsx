import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import {
  ActionButton,
  Loading,
  Tabs,
  useMessage
} from "lcano-react-ui";
import { AuthContext } from "../../../../contexts";
import { ParametroService } from "../../../../service";
import { Parametro, initialParametroState } from "../../../../types";
import DespesaParametroSectionForm from "./DespesaParametroSectionForm";
import RendaParametroSectionForm from "./RendaParametroSectionForm";
import ExtratoParametroSectionForm from "./ExtratoParametroSectionForm";
import AtivoParametroSectionForm from "./AtivoParametroSectionForm";

const ParametroPage: React.FC = () => {
  const [parametros, setParametros] = useState<Parametro>(initialParametroState);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useContext(AuthContext);
  const message = useMessage();

  const loadParametros = useCallback(async () => {
    if (!auth.usuario?.token) return;

    setIsLoading(true);
    try {
      const result = await ParametroService.getParametros(auth.usuario.token);
      if (result) setParametros(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar os parâmetros do usuário.", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth.usuario?.token, message]);

  const salvarParametros = useCallback(async () => {
    if (!auth.usuario?.token) return;

    await ParametroService.saveParametros(auth.usuario.token, parametros, message);
    await loadParametros();
  }, [auth.usuario?.token, parametros, message, loadParametros]);

  const updateParametros = useCallback((parametrosAtualizado: Parametro) => {
    setParametros(parametrosAtualizado);
  }, []);

  useEffect(() => {
    loadParametros();
  }, [loadParametros]);

  const tabs = [
    {
      label: "Despesa",
      content: <DespesaParametroSectionForm parametros={parametros} onUpdate={updateParametros} />,
    },
    {
      label: "Renda",
      content: <RendaParametroSectionForm parametros={parametros} onUpdate={updateParametros} />,
    },
    {
      label: "Ativo",
      content: <AtivoParametroSectionForm parametros={parametros} onUpdate={updateParametros} />,
    },
    {
      label: "Extrato",
      content: <ExtratoParametroSectionForm parametros={parametros} onUpdate={updateParametros} />,
    },
  ];

  return (
    <>
      <Loading isLoading={isLoading} />
      
      <ActionButton
        icon={<FaCheck />}
        hint="Salvar Parâmetros"
        onClick={salvarParametros}
      />

      <Tabs tabs={tabs} />
    </>
  );
};

export default ParametroPage;
