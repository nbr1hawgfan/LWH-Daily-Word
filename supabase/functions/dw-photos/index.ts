// LWH Daily Word: private photo storage (clippings, keepsakes, scanned sermon pages).
// Auth is the reader's Daily Word sign-in token, checked by dw_photo_uid().
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const BUCKET = 'dw-photos';
const MAX_PHOTOS = 5000;
const MAX_BYTES = 6 * 1024 * 1024;
const ID = /^[A-Za-z0-9]{6,40}$/;
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const out = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
function b64(s: string): Uint8Array {
  const bin = atob(s.replace(/^data:[^,]*,/, ''));
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}
const isJpeg = (a: Uint8Array) => a.length > 3 && a[0] === 0xff && a[1] === 0xd8 && a[2] === 0xff;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return out({ ok: false, error: 'method' }, 405);
  let body: any;
  try { body = await req.json(); } catch { return out({ ok: false, error: 'bad_json' }, 400); }
  const { data: uid, error: ue } = await sb.rpc('dw_photo_uid', { p_token: String(body.token || '') });
  if (ue) return out({ ok: false, error: 'server' }, 500);
  if (!uid) return out({ ok: false, error: 'signed_out' }, 401);
  const ids: string[] = (Array.isArray(body.ids) ? body.ids : []).filter((x: unknown) => typeof x === 'string' && ID.test(x)).slice(0, 200);

  if (body.action === 'put') {
    const id = String(body.id || '');
    if (!ID.test(id)) return out({ ok: false, error: 'bad_id' }, 400);
    let full: Uint8Array, thumb: Uint8Array;
    try { full = b64(String(body.full || '')); thumb = b64(String(body.thumb || '')); } catch { return out({ ok: false, error: 'bad_image' }, 400); }
    if (!isJpeg(full) || !isJpeg(thumb)) return out({ ok: false, error: 'bad_image' }, 400);
    if (full.length > MAX_BYTES) return out({ ok: false, error: 'too_big' }, 413);
    const { count } = await sb.from('dw_photos').select('photo_id', { count: 'exact', head: true }).eq('user_id', uid);
    const { data: have } = await sb.from('dw_photos').select('photo_id').eq('user_id', uid).eq('photo_id', id).maybeSingle();
    if (!have && (count || 0) >= MAX_PHOTOS) return out({ ok: false, error: 'full' }, 403);
    const o = { contentType: 'image/jpeg', upsert: true, cacheControl: '31536000' };
    const a = await sb.storage.from(BUCKET).upload(`${uid}/${id}.jpg`, full, o);
    if (a.error) return out({ ok: false, error: 'upload' }, 500);
    const t = await sb.storage.from(BUCKET).upload(`${uid}/${id}_t.jpg`, thumb, o);
    if (t.error) return out({ ok: false, error: 'upload' }, 500);
    await sb.from('dw_photos').upsert({ user_id: uid, photo_id: id, bytes: full.length + thumb.length });
    return out({ ok: true, id });
  }
  if (body.action === 'urls') {
    if (!ids.length) return out({ ok: true, urls: {} });
    const sfx = body.thumb ? '_t' : '';
    const { data, error } = await sb.storage.from(BUCKET).createSignedUrls(ids.map((i) => `${uid}/${i}${sfx}.jpg`), 3600);
    if (error) return out({ ok: false, error: 'server' }, 500);
    const urls: Record<string, string> = {};
    (data || []).forEach((d: any, i: number) => { if (d.signedUrl && !d.error) urls[ids[i]] = d.signedUrl; });
    return out({ ok: true, urls });
  }
  if (body.action === 'del') {
    if (ids.length) {
      await sb.storage.from(BUCKET).remove(ids.flatMap((i) => [`${uid}/${i}.jpg`, `${uid}/${i}_t.jpg`]));
      await sb.from('dw_photos').delete().eq('user_id', uid).in('photo_id', ids);
    }
    return out({ ok: true });
  }
  if (body.action === 'usage') {
    const { data } = await sb.from('dw_photos').select('bytes').eq('user_id', uid);
    return out({ ok: true, count: (data || []).length, bytes: (data || []).reduce((s: number, r: any) => s + (r.bytes || 0), 0), max: MAX_PHOTOS });
  }
  return out({ ok: false, error: 'action' }, 400);
});
