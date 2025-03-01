
import { RowDataPacket } from "mysql2"
import mysql, { FieldPacket } from 'mysql2/promise';

export interface Mute extends RowDataPacket {
    handle: string
    did: string
    date: string
    reason: string
    reasonUri: string
}

class muteRepository
{
    private connection:mysql.Connection;

    constructor() {

    }

    async connect() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            user: 'blueskyreader',
            database: 'bluesky',
        });
        return this.connection;
    }

    async readAll(): Promise<any> {
        return await this.connection.execute<Mute[]>("select * from mutes")
    }
    
    async readAllAggregate(): Promise<any> {
        return await this.connection.execute<Mute[]>("SELECT distinct handle, count(*) as freq FROM mutes group by handle order by freq desc limit 100")
    }
    

    async insert(mute: Mute): Promise<any> {
        try {
            return await this.connection.execute('INSERT INTO mutes (handle, did, date, reason, reasonUri) VALUES (?,?,?,?,?)', 
                [mute.handle, mute.did, mute.date, mute.reason, mute.reasonUri]);
        } catch (err) {
            console.log(err)
        }
    }
}

export default muteRepository;
