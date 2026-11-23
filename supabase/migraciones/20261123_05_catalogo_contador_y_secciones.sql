-- 23/11/2026 · Aplicada como "catalogo_contador_y_secciones".
-- Contador simple del catálogo (sin datos personales): el público (anon) solo puede INSERTAR tipo + modelo; leer, solo miembros.
-- catalogo_mas_pedidos(): pública, devuelve solo modelo_id + cantidad (veces agregado a la bolsa), y solo de modelos publicados.
-- catalogo_publico(): además devuelve 'id' y 'publicado_en' (= modelos.datos->>'publicadoEn', lo guarda Gestión al publicar por primera vez).
create table public.catalogo_eventos (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('agregar_bolsa','pedir_whatsapp')),
  modelo_id text check (modelo_id is null or length(modelo_id) <= 64),
  creado_en timestamptz not null default now()
);
create index catalogo_eventos_modelo on public.catalogo_eventos (modelo_id) where tipo = 'agregar_bolsa';
alter table public.catalogo_eventos enable row level security;
grant insert (tipo, modelo_id) on public.catalogo_eventos to anon;
create policy eventos_insertar_publico on public.catalogo_eventos for insert to anon
  with check ((tipo = 'agregar_bolsa' and modelo_id is not null) or (tipo = 'pedir_whatsapp' and modelo_id is null));
grant select on public.catalogo_eventos to authenticated;
create policy eventos_ver_miembros on public.catalogo_eventos for select to authenticated using (privado.es_miembro());

create or replace function public.catalogo_mas_pedidos()
returns table (modelo_id text, cantidad bigint)
language sql stable security definer set search_path to 'public'
as $$
  select e.modelo_id, count(*) from public.catalogo_eventos e
  join public.modelos m on m.id = e.modelo_id and not m.borrado
   and coalesce((m.datos->>'publicado')::boolean, false)
  where e.tipo = 'agregar_bolsa'
  group by e.modelo_id order by count(*) desc limit 12;
$$;
revoke all on function public.catalogo_mas_pedidos() from public;
grant execute on function public.catalogo_mas_pedidos() to anon, authenticated;

create or replace function public.catalogo_publico()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public', 'privado'
as $function$
  with m as (
    select id, datos from public.modelos
    where not borrado
      and coalesce((datos->>'publicado')::boolean, false)
      and coalesce((datos->>'activo')::boolean, true)
      and jsonb_typeof(datos->'fotos') = 'array' and jsonb_array_length(datos->'fotos') > 0
      and coalesce((datos->>'precioVenta')::numeric, 0) > 0
  ), t as (
    select s.datos->>'modeloId' as mid, s.datos->>'talle' as talle, greatest(0, privado.stock_num(s.datos)) as q
    from public.stock s
    where not s.borrado and coalesce((s.datos->>'activo')::boolean, true)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', m.id,
      'num', (m.datos->>'num')::int,
      'nombre', m.datos->>'nombre',
      'categoria', m.datos->>'categoria',
      'precio', (m.datos->>'precioVenta')::numeric,
      'fotos', m.datos->'fotos',
      'publicado_en', m.datos->>'publicadoEn',
      'talles', (select jsonb_object_agg(t.talle, t.q) from t where t.mid = m.id)
    ) order by (m.datos->>'num')::int desc), '[]'::jsonb)
  from m
  where exists (select 1 from t where t.mid = m.id and t.q > 0);
$function$;
