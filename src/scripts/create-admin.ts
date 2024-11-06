import * as _dotenv from 'dotenv';
_dotenv.config();

import { db, firestoreTimestamp } from '../utils/firestore-helpers';
import { encryptPassword } from '../utils/password';

async function createAdmin() {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    const usersQuerySnapshot = await db
      .users.where('email', '==', process.env.ADMIN_EMAIL).get();

    if (usersQuerySnapshot.empty) {
      const userRef = db.users.doc();
      await userRef.set({
        email: process.env.ADMIN_EMAIL,
        username: process.env.ADMIN_USERNAME,
        password: encryptPassword(process.env.ADMIN_PASSWORD as string),
        role: 'admin',
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      console.log('Admin created successfully!');
    }
  }
}

createAdmin().catch((err) => {
  console.error(err);
})
