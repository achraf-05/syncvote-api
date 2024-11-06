import { Timestamp } from 'firebase/firestore';
import { Comment } from './Comment';

export interface Post {
  id?: string;
  title?: string;
  description?: string;
  voteCount?: number;
  categories?: string[];
  createdBy?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  comments?: Comment[];
  

}
