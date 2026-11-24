-- QR de la tarjeta (/ig/): permite contar escaneos anónimos con tipo 'qr_tarjeta' (sin modelo).
alter table public.catalogo_eventos drop constraint catalogo_eventos_tipo_check;
alter table public.catalogo_eventos add constraint catalogo_eventos_tipo_check check (tipo = any (array['agregar_bolsa'::text, 'pedir_whatsapp'::text, 'qr_tarjeta'::text]));
drop policy eventos_insertar_publico on public.catalogo_eventos;
create policy eventos_insertar_publico on public.catalogo_eventos for insert to anon with check (
  ((tipo = 'agregar_bolsa') and (modelo_id is not null))
  or ((tipo = 'pedir_whatsapp') and (modelo_id is null))
  or ((tipo = 'qr_tarjeta') and (modelo_id is null))
);
