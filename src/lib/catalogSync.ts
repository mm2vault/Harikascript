import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { GameItem, Product, ScriptItem } from '../types';
import { firebaseAuth, firebaseDb } from './firebase';

type ItemType = 'script' | 'game' | 'product' | 'community_frame';

const refFor = (itemType: ItemType, id: string) => doc(firebaseDb, 'catalog_items', itemType + '_' + id);

export async function loadSharedCatalog() {
  const snap = await getDocs(collection(firebaseDb, 'catalog_items'));
  const customScripts: ScriptItem[] = [], customGames: GameItem[] = [], customProducts: Product[] = [], communityFrames: Product[] = [];
  const deletedScriptIds: string[] = [], deletedGameIds: string[] = [], deletedProductIds: string[] = [];
  snap.forEach((d) => {
    const row = d.data() as any, payload = row.payload;
    if (!payload || !row.item_type) return;
    if (row.item_type === 'script') row.is_deleted ? deletedScriptIds.push(row.item_id) : customScripts.push(payload);
    if (row.item_type === 'game') row.is_deleted ? deletedGameIds.push(row.item_id) : customGames.push(payload);
    if (row.item_type === 'product') row.is_deleted ? deletedProductIds.push(row.item_id) : customProducts.push(payload);
    if (row.item_type === 'community_frame' && !row.is_deleted) communityFrames.push(payload);
  });
  return { customScripts, customGames, customProducts, communityFrames, deletedScriptIds, deletedGameIds, deletedProductIds };
}

export async function upsertSharedCatalogItem(itemType: ItemType, item: any, isDeleted = false) {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('Firebase oturumu yok.');
  await setDoc(refFor(itemType, item.id), {
    item_type: itemType, item_id: item.id, payload: item, is_deleted: isDeleted,
    created_by: user.uid, updated_at: new Date().toISOString()
  }, { merge: true });
}

export async function deleteSharedCatalogItem(itemType: ItemType, id: string) {
  return upsertSharedCatalogItem(itemType, { id }, true);
}
