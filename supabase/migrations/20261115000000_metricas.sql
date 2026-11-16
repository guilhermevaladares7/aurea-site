-- Métricas de acesso do site, lidas pela AFIO pela função metricas-afio.
-- Sem cookie e sem IP: "visitante" é um código que muda todo dia (ver functions/_shared/metricas.ts).

-- Uma linha por (dia, página, tipo, alvo, visitante). Repetir só soma em "vezes".
create table if not exists public.metricas_eventos (
  dia date not null,
  pagina text not null,
  tipo text not null check (tipo in ('visita', 'clique')),
  alvo text not null default '',
  visitante text not null,
  origem text not null default 'direto',
  vezes integer not null default 1 check (vezes between 1 and 1000),
  primary key (dia, pagina, tipo, alvo, visitante)
);

-- Limite de envio: quantos eventos cada IP (em hash) mandou em cada janela de 10 minutos.
create table if not exists public.metricas_limite (
  chave text not null,
  janela timestamptz not null,
  n integer not null default 1,
  primary key (chave, janela)
);

-- Ninguém lê nem grava direto pelas chaves públicas: só as funções abaixo, com a chave de serviço.
alter table public.metricas_eventos enable row level security;
alter table public.metricas_limite enable row level security;
revoke all on table public.metricas_eventos from anon, authenticated;
revoke all on table public.metricas_limite from anon, authenticated;

create or replace function public.metricas_registrar(
  p_dia date,
  p_pagina text,
  p_tipo text,
  p_alvo text,
  p_visitante text,
  p_origem text,
  p_ip_hash text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_janela timestamptz := to_timestamp(floor(extract(epoch from now()) / 600) * 600);
  v_n integer;
begin
  -- cerca de 120 eventos a cada 10 minutos por IP; passou disso, não grava
  insert into metricas_limite (chave, janela, n)
  values (p_ip_hash, v_janela, 1)
  on conflict (chave, janela) do update set n = metricas_limite.n + 1
  returning n into v_n;
  if v_n > 120 then
    return;
  end if;

  -- a origem fica a da primeira vez no dia; repetir só aumenta o contador, até 1000
  insert into metricas_eventos (dia, pagina, tipo, alvo, visitante, origem, vezes)
  values (p_dia, p_pagina, p_tipo, coalesce(p_alvo, ''), p_visitante, p_origem, 1)
  on conflict (dia, pagina, tipo, alvo, visitante)
  do update set vezes = least(metricas_eventos.vezes + 1, 1000);

  -- de vez em quando, apaga o que tem mais de 90 dias e as janelas de limite antigas
  if random() < 0.02 then
    delete from metricas_eventos where dia < (now() at time zone 'America/Sao_Paulo')::date - 90;
    delete from metricas_limite where janela < now() - interval '1 day';
  end if;
end;
$$;

-- Os totais do período, já agregados: nada pessoal sai daqui.
create or replace function public.metricas_resumo(p_desde date)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with v as (
    select dia, pagina, origem, visitante, vezes
    from metricas_eventos
    where tipo = 'visita' and dia >= p_desde
  ),
  p as (
    select pagina, sum(vezes)::int as visitas, count(*)::int as pessoas
    from v group by pagina
  ),
  c as (
    select pagina, alvo, sum(vezes)::int as cliques, count(*)::int as pessoas
    from metricas_eventos
    where tipo = 'clique' and dia >= p_desde
    group by pagina, alvo
  ),
  o as (
    select pagina, origem, sum(vezes)::int as visitas, count(*)::int as pessoas
    from v group by pagina, origem
  ),
  o_pos as (
    select o.*, row_number() over (partition by pagina order by visitas desc, origem) as pos
    from o
  ),
  -- as 12 maiores origens de cada página; o resto vira uma linha "outros"
  o_fim as (
    select pagina,
           case when pos <= 12 then origem else 'outros' end as origem,
           sum(visitas)::int as visitas,
           sum(pessoas)::int as pessoas
    from o_pos
    group by 1, 2
  ),
  -- por dia, "pessoas" é no site inteiro: quem abriu duas páginas conta uma vez
  d as (
    select dia, sum(vezes)::int as visitas, count(distinct visitante)::int as pessoas
    from v group by dia
  )
  select jsonb_build_object(
    'paginas', coalesce((
      select jsonb_agg(jsonb_build_object('pagina', pagina, 'visitas', visitas, 'pessoas', pessoas)
                       order by visitas desc, pagina) from p), '[]'::jsonb),
    'cliques', coalesce((
      select jsonb_agg(jsonb_build_object('pagina', pagina, 'alvo', alvo, 'cliques', cliques, 'pessoas', pessoas)
                       order by cliques desc, pagina, alvo) from c), '[]'::jsonb),
    'origens', coalesce((
      select jsonb_agg(jsonb_build_object('pagina', pagina, 'origem', origem, 'visitas', visitas, 'pessoas', pessoas)
                       order by pagina, (origem = 'outros'), visitas desc, origem) from o_fim), '[]'::jsonb),
    'porDia', coalesce((
      select jsonb_agg(jsonb_build_object('dia', to_char(dia, 'YYYY-MM-DD'), 'visitas', visitas, 'pessoas', pessoas)
                       order by dia) from d), '[]'::jsonb)
  );
$$;

revoke execute on function public.metricas_registrar(date, text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.metricas_resumo(date) from public, anon, authenticated;
grant execute on function public.metricas_registrar(date, text, text, text, text, text, text) to service_role;
grant execute on function public.metricas_resumo(date) to service_role;
