import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container, FieldValue, Loading, Stack, SummaryCard, ToggleSwitch, ToggleSwitchOption, useMessage, VariantColor } from "lcano-react-ui";
import { useAuth } from "../../../contexts";
import { DashboardService } from "../../../service";
import { Dashboard } from "../../../types";
import CategoriaListSection from "./CategoriaListSection";

const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 6 }, (_, i) => ANO_ATUAL - i);
const ANOS_OPTIONS = ANOS.map((a) => ({ key: String(a), value: String(a) }));

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const MESES_OPTIONS = MESES.map((label, idx) => ({ key: String(idx + 1), value: label }));

const MODO_OPTION_A: ToggleSwitchOption<Modo> = { label: 'Mensal', value: 'mensal' };
const MODO_OPTION_B: ToggleSwitchOption<Modo> = { label: 'Anual', value: 'anual' };

type Modo = 'mensal' | 'anual';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

const getSaldoVariant = (v: number): VariantColor => v >= 0 ? 'success' : 'warning';

const isDashboardVazio = (dados: Dashboard) =>
  dados.totalReceita === 0 &&
  dados.totalDespesa === 0 &&
  dados.saldo === 0 &&
  dados.totalInvestidoAtivos === 0 &&
  dados.despesasPorCategoria.length === 0 &&
  dados.receitasPorCategoria.length === 0 &&
  dados.ativosPorCategoria.length === 0;

const FluxoCaixaResumo: React.FC = () => {
  const { usuario } = useAuth();
  const message = useMessage();

  const [modo, setModo] = useState<Modo>('mensal');
  const [ano, setAno] = useState(ANO_ATUAL);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [dados, setDados] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!usuario?.token) return;
    setIsLoading(true);
    const mesFiltro = modo === 'mensal' ? mes : null;
    DashboardService.getDashboard(usuario.token, ano, mesFiltro, message)
      .then(resultado => setDados(resultado ?? null))
      .finally(() => setIsLoading(false));
  }, [usuario?.token, ano, mes, modo, message]);

  return (
    <Container padding="10px">
      <Loading isLoading={isLoading} />
      <Stack direction="column" divider="top">
        <Stack direction="row" divider="x" justifyCenter style={{ flexWrap: 'wrap' }}>
          <ToggleSwitch<Modo>
            optionA={MODO_OPTION_A}
            optionB={MODO_OPTION_B}
            value={modo}
            onChange={setModo}
          />
          <FieldValue
            description="Ano"
            type="SELECT"
            value={{ key: String(ano), value: String(ano) }}
            editable
            options={ANOS_OPTIONS}
            onUpdate={(v) => setAno(Number(v))}
          />
          {modo === 'mensal' && (
            <FieldValue
              description="Mês"
              type="SELECT"
              value={{ key: String(mes), value: MESES[mes - 1] }}
              editable
              options={MESES_OPTIONS}
              onUpdate={(v) => setMes(Number(v))}
            />
          )}
        </Stack>
        <Stack direction="column" gap="10px" style={{ padding: '10px' }}>
          {dados && (
            <>
              {isDashboardVazio(dados) ? (
                <EmptyMessage>Nenhum lançamento encontrado no período selecionado.</EmptyMessage>
              ) : (
                <>
                  <SummaryCardGrid>
                    <SummaryCard label="Receita Total" value={fmt(dados.totalReceita)} variant="success" />
                    <SummaryCard label="Despesa Total" value={fmt(dados.totalDespesa)} variant="warning" />
                    <SummaryCard label="Saldo" value={fmt(dados.saldo)} variant={getSaldoVariant(dados.saldo)} />
                    <SummaryCard label="Total em Ativos" value={fmt(dados.totalInvestidoAtivos)} variant="info" />
                  </SummaryCardGrid>
                  <CategoriaGrid>
                    <CategoriaListSection
                      titulo="Despesas por Categoria"
                      itens={dados.despesasPorCategoria}
                      variantPadrao="warning"
                      format={fmt}
                    />
                    <CategoriaListSection
                      titulo="Receitas por Categoria"
                      itens={dados.receitasPorCategoria}
                      variantPadrao="success"
                      format={fmt}
                    />
                    <CategoriaListSection
                      titulo="Ativos por Categoria"
                      itens={dados.ativosPorCategoria}
                      variantPadrao="info"
                      variantNegativo="warning"
                      format={fmt}
                    />
                  </CategoriaGrid>
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default FluxoCaixaResumo;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 15px;
`;

const SummaryCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoriaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;