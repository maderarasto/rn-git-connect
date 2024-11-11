import { AccountType } from '@src/api/types';
import { useSQLiteContext } from 'expo-sqlite';

export type Connection = {
  id?: number
  account_id: string
  service: AccountType
  username: string
  fullname: string
  expired?: boolean
}

const useConnections = () => {
  const db = useSQLiteContext();

  async function getConnections() {
    return db.getAllAsync<Connection>(`
      SELECT * FROM connections  
    `);
  }

  async function findConnection(accountId: string) {
    return db.getFirstAsync(`
      SELECT * FROM connections WHERE account_id = ?  
    `, [ accountId ]);
  }  

  async function saveConnection(conn: Connection) {
    const foundConn = await findConnection(conn.account_id);
    
    if (!foundConn) {
      await storeConnection(conn);
    }
    
  }

  async function storeConnection(conn: Connection) {
    const result = await db.runAsync(`
      INSERT INTO connections (account_id, service, username, fullname, expired)
      VALUES (?, ?, ?, ?, ?)  
    `, [conn.account_id, conn.service, conn.username, conn.fullname, conn.expired ?? 0]);
  }

  return {
    saveConnection,
    getConnections,
  }
}

export default useConnections;