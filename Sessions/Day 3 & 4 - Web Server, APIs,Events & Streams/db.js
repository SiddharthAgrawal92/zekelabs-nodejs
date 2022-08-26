
const dbClient = async () => {
    const dbUri = "mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/test";
    const { MongoClient } = require('mongodb');
    return new MongoClient(dbUri);
}

const getDatabases = async () => {
    const client = await dbClient().catch(err => console.log(err));
    try {
        await client.connect();
        const databaseList = await client.db().admin().listDatabases();
        console.log('Database List:');
        databaseList.databases.forEach(db => {
            console.log(`-${db.name}`);
        });
    } catch (err) {
        console.log(err)
    }
    finally {
        await client.close();
    }
}

const getAirBnbReviews = async (noOfRecord) => {
    const client = await dbClient().catch(err => console.log(err));
    try {
        await client.connect();
        return await client.db('sample_airbnb').collection('listingsAndReviews').find({}).limit(noOfRecord).toArray();
    } catch (err) {
        console.log(err)
    }
    finally {
        await client.close();
    }
}

module.exports = {
    getDatabases,
    getAirBnbReviews
}