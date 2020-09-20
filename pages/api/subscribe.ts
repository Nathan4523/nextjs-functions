import { NowRequest, NowResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';
import url from 'url';

// para deixar como codeStarted
// vale lembrar que ele entende quando está sendo usado várias vezes ou não, então sim! Ele ira desligar
let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const dbName = url.parse(uri).pathname.substr(1);

    const db = client.db(dbName);

    cachedDb = db;

    return db;
}

export default async (request: NowRequest, response: NowResponse) => {
    const { email } = request.body;

    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('subscribers');

    await collection.insertOne({
        email,
        subscribedAt: new Date(),
    });

    return response.status(201).json({ ok: true });
}

/**
 * Na serveless, temos 2 tipos iniciação deles, sendo elas codeStarted e routeStarted
 *
 * A routeStart, em termos claro, ela literalmente não compartilha as funções para as próximas requisições, pensa assim:
 * Mil pessoas tentam assinar a newsletters ao mesmo tempo. Quando não há um compartilhamento de dados (conexões db) elas
 * sempre iram se conectar ao banco novamente, ou seja, a cada 1 pessoa, há uma nova requisição. O ruim disso é que o server irá
 * bloquear.
 *
 * Na questão do codeStart, o node entende que algumas informações devem ser compartilhada para a próxima requisição, por exemplo
 * a conexão do banco, 1 vez conectada a próxima requisição não precisa conectar, ela simplesmente pega o dado da requisição passada
 *
 * Para enxergar essa diferenciação, as funções que estão fora do export, ela significa que vão ser compartilhada, vão ser uma
 * codeStarted
 */