import { GameItem, Product, ScriptItem } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

type ItemType = 'script' | 'game' | 'product' | 'community_frame';

export async function loadSharedCatalog() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('catalog_items').select('item_type,item_id,payload,is_deleted');
  if (error) throw error;
  const customScripts: ScriptItem[] = [];
  const customGames: GameItem[] = [];
  const customProducts: Product[] = [];
  const communityFrames: Product[] = [];
  const deletedScriptIds: string[] = [];
  const deletedGameIds: string[] = [];
  const deletedProductIds: string[] = [];

  for (const row of data || []) {
    const payload = row.payload as any;
    if (row.item_type === 'script') { row.is_deleted ? deletedScriptIds.push(row.item_id) : customScripts.push(payload); }
    if (row.item_type === 'game') { row.is_deleted ? deletedGameIds.push(row.item_id) : customGames.push(payload); }
    if (row.item_type === 'product') { row.is_deleted ? deletedProductIds.push(row.item_id) : customProducts.push(payload); }
    if (row.item_type === 'community_frame' && !row.is_deleted) communityFrames.push(payload);
  }
  return { customScripts, customGames, customProducts, communityFrames, deletedScriptIds, deletedGameIds, deletedProductIds };
}

export async function upsertSharedCatalogItem(itemType: ItemType, item: any, isDeleted = false) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Supabase oturumu yok.');
  const { error } = await supabase.from('catalog_items').upsert({
    item_type: itemType,
    item_id: item.id,
    payload: item,
    is_deleted: isDeleted,
    created_by: user.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'item_type,item_id' });
  if (error) throw error;
}

export async function deleteSharedCatalogItem(itemType: ItemType, id: string) {
  return upsertSharedCatalogItem(itemType, { id }, true);
}
