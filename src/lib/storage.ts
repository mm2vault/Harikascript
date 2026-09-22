import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseAuth, firebaseStorage } from './firebase';

export async function uploadUserImage(file: File, folder: 'avatars' | 'cosmetics') {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('Firebase oturumu yok.');
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = folder === 'avatars'
    ? `avatars/${user.uid}/${Date.now()}_${safe}`
    : `cosmetics/${Date.now()}_${safe}`;
  const snapshot = await uploadBytes(ref(firebaseStorage, path), file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}