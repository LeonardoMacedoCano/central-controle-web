import { FieldValue, Panel, Stack } from "lcano-react-ui";
import {
  getCodigoTipoMovimento,
  getDescricaoTipoMovimento,
  getTipoMovimentoByCodigo,
  MovimentacaoCategoria,
  tipoMovimentoOptions,
} from "../../../../types";

interface CategoriaSectionSectionFormProps {
  categoria: MovimentacaoCategoria;
  onUpdate: (categoriaAtualizada: MovimentacaoCategoria) => void;
}

const MovimentacaoCategoriaSectionForm: React.FC<CategoriaSectionSectionFormProps> = ({
  categoria,
  onUpdate,
}) => {
  const updateCategoria = (fields: Partial<MovimentacaoCategoria>) => {
    onUpdate({ ...categoria, ...fields });
  };

  return (
    <Panel>
      <Stack direction="column" divider="top">
        <FieldValue
          description="Descrição"
          type="STRING"
          value={categoria.descricao}
          editable
          onUpdate={(value: any) => {
            if (typeof value === "string") updateCategoria({ descricao: value });
          }}
        />
        <FieldValue
          description="Tipo"
          type="SELECT"
          options={tipoMovimentoOptions}
          value={{
            key: getCodigoTipoMovimento(categoria.tipo),
            value: getDescricaoTipoMovimento(categoria.tipo),
          }}
          editable
          onUpdate={(value: any) => {
            const tipo = getTipoMovimentoByCodigo(value);
            if (tipo) updateCategoria({ tipo });
          }}
        />
      </Stack>
    </Panel>
  );
};

export default MovimentacaoCategoriaSectionForm;
