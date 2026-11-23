-- 23/11/2026 · Aplicada como "catalogo_fotos_y_lectura_publica".
-- Bucket público "fotos" (solo fotos de prendas; jpg/webp/png, máx 3 MB): cualquiera las ve por URL, solo los miembros suben/cambian/borran.
-- catalogo_publico(): lectura pública (anon) que devuelve SOLO modelos publicados, activos, con fotos, con precio y con stock:
--   [{ num, nombre, categoria, precio, fotos: [rutas], talles: { talle: disponible } }]. Nada de alias, costos, clientes, pedidos ni config.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 3145728, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy fotos_ver_miembros on storage.objects for select to authenticated using (bucket_id = 'fotos' and privado.es_miembro());
create policy fotos_subir on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and privado.es_miembro());
create policy fotos_cambiar on storage.objects for update to authenticated using (bucket_id = 'fotos' and privado.es_miembro()) with check (bucket_id = 'fotos' and privado.es_miembro());
create policy fotos_borrar on storage.objects for delete to authenticated using (bucket_id = 'fotos' and privado.es_miembro());
create or replace function public.catalogo_publico()
returns jsonb language sql stable security definer set search_path to 'public', 'privado'
as $f$
  with m as (
    select id, datos from public.modelos
    where not borrado and coalesce((datos->>'publicado')::boolean, false) and coalesce((datos->>'activo')::boolean, true)
      and jsonb_typeof(datos->'fotos') = 'array' and jsonb_array_length(datos->'fotos') > 0
      and coalesce((datos->>'precioVenta')::numeric, 0) > 0
  ), t as (
    select s.datos->>'modeloId' as mid, s.datos->>'talle' as talle, greatest(0, privado.stock_num(s.datos)) as q
    from public.stock s where not s.borrado and coalesce((s.datos->>'activo')::boolean, true)
  )
  select coalesce(jsonb_agg(jsonb_build_object('num', (m.datos->>'num')::int, 'nombre', m.datos->>'nombre', 'categoria', m.datos->>'categoria',
      'precio', (m.datos->>'precioVenta')::numeric, 'fotos', m.datos->'fotos',
      'talles', (select jsonb_object_agg(t.talle, t.q) from t where t.mid = m.id)) order by (m.datos->>'num')::int desc), '[]'::jsonb)
  from m where exists (select 1 from t where t.mid = m.id and t.q > 0);
$f$;
revoke all on function public.catalogo_publico() from public;
grant execute on function public.catalogo_publico() to anon, authenticated;
