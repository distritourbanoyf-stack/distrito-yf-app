-- 22/11/2026 · Aplicada como "permisos_tablas_app".
-- Los proyectos nuevos de Supabase no dan permisos de tabla por defecto: sin esto la app da
-- "permission denied" al cargar. Solo usuarios logueados; RLS sigue filtrando por miembro y no hay políticas de borrado.
grant usage on schema public to authenticated, service_role;
do $$ declare t text; begin
  foreach t in array array['clientas','lives','pedidos','stock','movimientos','mostrador','compras','pagos','paquetes','config','modelos','promos','cobros','conversaciones','derivados'] loop
    execute format('grant select, insert, update on public.%I to authenticated', t);
  end loop;
end $$;
grant select on public.miembros to authenticated;
grant select on public.mabel_mensajes to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on function public.mover_stock(text, int, text, text) to authenticated;
