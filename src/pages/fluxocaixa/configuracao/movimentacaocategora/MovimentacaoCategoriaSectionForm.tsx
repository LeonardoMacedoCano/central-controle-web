import { FieldValue, Stack } from "lcano-react-ui";
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
    <Stack direction="column" divider="top" style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
      <FieldValue
        description="Descrição"
        type="string"
        value={categoria.descricao}
        editable
        onUpdate={(value: any) => {
          if (typeof value === "string") updateCategoria({ descricao: value });
        }}
      />
      <FieldValue
        description="Tipo"
        type="select"
        options={tipoMovimentoOptions}
        value={{
          key: getCodigoTipoMovimento(categoria.tipo),
          value: getDescricaoTipoMovimento(categoria.tipo),
        }}
        editable
        onUpdate={(value: any) => {
          if (typeof value === "string") {
            const tipo = getTipoMovimentoByCodigo(value);
            if (tipo) updateCategoria({ tipo });
          }
        }}
      />
    </Stack>
  );
};

export default MovimentacaoCategoriaSectionForm;
