import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts";
import { FaCheck } from "react-icons/fa";
import RendaParametroSectionForm from "./RendaParametroSectionForm";
import AtivoParametroSectionForm from "./AtivoParametroSectionForm";
import ExtratoParametroSectionForm from "./ExtratoParametroSectionForm";
import DespesaParametroSectionForm from "./DespesaParametroSectionForm";
import { initialParametroState, MovimentacaoCategoria, Parametro } from "../../../../types";
import { ActionButton, Container, Loading, Panel, Tabs, useMessage } from "lcano-react-ui";
import { ParametroService } from "../../../../service";

const ParametroPage: React.FC = () => {
  const [parametros, setParametros] = useState<Parametro>(initialParametroState);
  const [categoriasDespesa, setCategoriasDespesa] = useState<MovimentacaoCategoria[]>([]);
  const [categoriasRenda, setCategoriasRenda] = useState<MovimentacaoCategoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = useContext(AuthContext);
  const message = useMessage();

  useEffect(() => {
    if (!auth.usuario?.token) return;
  
    setIsLoading(true);
    Promise.all([loadParametros(), loadCategoriasDespesa(), loadCategoriasRenda()])
      .finally(() => setIsLoading(false));
  }, [auth.usuario?.token]);
  
  const loadParametros = async () => {
    try {
      const result = await ParametroService.getParametros(auth.usuario!.token);
      if (result) setParametros(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar os parâmetros do usuário.", error);
    }
  };
  
  const loadCategoriasDespesa = async () => {
    try {
//      const result = await categoriaDespesaService.getAllCategorias(auth.usuario!.token);
  //    setCategoriasDespesa(result || []);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar as categorias de despesa.", error);
    }
  };
  
  const loadCategoriasRenda = async () => {
    try {
//      const result = await categoriaRendaService.getAllCategorias(auth.usuario!.token);
  //    setCategoriasRenda(result || []);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar as categorias de Renda.", error);
    }
  };
  
  const salvarParametros = async () => {
    if (!auth.usuario?.token) return;
  
    await ParametroService.saveParametros(auth.usuario?.token, parametros, message);
    loadParametros;
  };

  const updateParametros = (parametrosAtualizado: Parametro) => {
    setParametros(parametrosAtualizado);
  };

  const tabs = [
    {
      label: "Despesa",
      content: <DespesaParametroSectionForm parametros={parametros} categorias={categoriasDespesa} onUpdate={updateParametros} />,
    },
    {
      label: "Renda",
      content: <RendaParametroSectionForm parametros={parametros} categorias={categoriasRenda} onUpdate={updateParametros} />,
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
    <Container>
      <Loading isLoading={isLoading} />
      <ActionButton
        icon={<FaCheck />}
        hint={"Salvar Parâmetros"}
        onClick={salvarParametros}
      />
      <Panel maxWidth="1000px" title="Fluxo Caixa > Parâmetros">
        <Tabs tabs={tabs} />
      </Panel>
    </Container>
  );
};

export default ParametroPage;