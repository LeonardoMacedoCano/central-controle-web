import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  ActionButton,
  Loading,
  Tabs,
  useMessage
} from "lcano-react-ui";
import { useAuth, useParametro } from "../../../../contexts";
import { ParametroService } from "../../../../service";
import { Parametro, initialParametroState } from "../../../../types";
import DespesaParametroSectionForm from "./DespesaParametroSectionForm";
import RendaParametroSectionForm from "./RendaParametroSectionForm";
import ExtratoParametroSectionForm from "./ExtratoParametroSectionForm";
import AtivoParametroSectionForm from "./AtivoParametroSectionForm";

const ParametroFormPage: React.FC = () => {
  const [parametros, setParametros] = useState<Parametro>(initialParametroState);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const { reloadParametros } = useParametro();
  const message = useMessage();

  useEffect(() => {
    if (!auth.usuario?.token) return;
    setIsLoading(true);
    ParametroService.getParametros(auth.usuario.token)
      .then(result => { if (result) setParametros(result); })
      .catch(error => message.showErrorWithLog("Erro ao carregar os parâmetros do usuário.", error))
      .finally(() => setIsLoading(false));
  }, [auth.usuario?.token, message]);

  const salvarParametros = async () => {
    if (!auth.usuario?.token) return;
    await ParametroService.saveParametros(auth.usuario.token, parametros, message);
    const result = await ParametroService.getParametros(auth.usuario.token);
    if (result) setParametros(result);
    await reloadParametros();
  };

  const tabs = [
    {
      label: "Despesa",
      content: <DespesaParametroSectionForm parametros={parametros} onUpdate={setParametros} />,
    },
    {
      label: "Renda",
      content: <RendaParametroSectionForm parametros={parametros} onUpdate={setParametros} />,
    },
    {
      label: "Ativo",
      content: <AtivoParametroSectionForm parametros={parametros} onUpdate={setParametros} />,
    },
    {
      label: "Extrato",
      content: <ExtratoParametroSectionForm parametros={parametros} onUpdate={setParametros} />,
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

export default ParametroFormPage;
