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
    const connections = await db.getAllAsync<Connection>(`
      SELECT * FROM connections  
    `);

    return connections.map((conn) => ({
      ...conn,
      expired: !!conn.expired,
    }))
  }

  async function findConnection(accountId: string) {
    const connection = await db.getFirstAsync<Connection>(`
      SELECT * FROM connections WHERE account_id = ?  
    `, [ accountId ]);

    if (!connection) {
      return null;
    }

    return {
      ...connection,
      expired: !!connection.expired
    };
  }  

  async function saveConnection(conn: Connection) {
    const foundConn = await findConnection(conn.account_id);
    
    if (!foundConn) {
      await storeConnection(conn);
    } else {
      await updateConnection(conn);
    }
  }

  async function storeConnection(conn: Connection) {
    const result = await db.runAsync(`
      INSERT INTO connections (account_id, service, username, fullname, expired)
      VALUES (?, ?, ?, ?, ?)  
    `, [conn.account_id, conn.service, conn.username, conn.fullname, conn.expired ? 1 : 0]);
  }

  async function updateConnection(conn: Connection) {
    const result = await db.runAsync(`
      UPDATE connections 
      SET 
        service = ?, 
        username = ?, 
        fullname = ?, 
        expired = ?
      WHERE account_id = ?
    `, conn.service, conn.username, conn.fullname, conn.expired ? 1 : 0, conn.account_id);
  }

  async function removeConnection(conn: Connection) {
    const result = await db.runAsync(`
      DELETE FROM connections WHERE account_id = ?  
    `, [conn.account_id]);
  }

  return {
    getConnections,
    findConnection,
    saveConnection,
    removeConnection,
  }
}

export default useConnections;