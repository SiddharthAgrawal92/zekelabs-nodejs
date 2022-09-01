
const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const dataUri = 'mongodb+srv://sid1605:sT2kdICiGGtnsmgz@cluster0.3o8fgzr.mongodb.net/test'
    return new MongoClient(dataUri);
}

async function getItems(record, skip) {
    const client = await main().catch(console.error);
    try {
        await client.connect().catch(err => console.error(err));

        const fetchedRecords = await client.db('myDb').collection('items').find({}).limit(record).skip(skip).toArray();
        const totalRecords = await client.db('mongodbVSCodePlaygroundDB').collection('sales').count();
        return {
            items: fetchedRecords,
            totalRecords: totalRecords
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

const insertItem = async (payload) => {
    const client = await main().catch(console.error);
    try {
        await client.connect().catch(err => console.error(err));

        const result = await client.db('myDb').collection('items').insertMany(payload);
        if (result.acknowledged) {
            let insertedIds = [];
            Object.values(result.insertedIds).forEach(doc_id => {
                insertedIds.push(doc_id);
            });
            return {
                msg: "Item(s) has been inserted successfully!",
                ids: insertedIds
            }
        } else {
            return {
                error: "Sorry, something went wrong at server level!"
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const updateItem = async (id, payload) => {
    const client = await main().catch(console.error);
    try {
        await client.connect().catch(err => console.error(err));

        const result = await client.db('myDb').collection('items').updateOne({ _id: ObjectId(id) }, {
            $set: payload
        });
        if (result.modifiedCount) {
            return {
                msg: "Item has been updated successfully!"
            }
        } else {
            return {
                error: "Sorry, something went wrong at server level!"
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const deleteItem = async (id) => {
    const client = await main().catch(console.error);
    try {
        await client.connect().catch(err => console.error(err));

        const result = await client.db('myDb').collection('items').deleteOne({ _id: ObjectId(id) });
        if (result.acknowledged) {
            return {
                msg: "Item has been deleted successfully!",
                deletedCount: result.deletedCount
            }
        } else {
            return {
                error: "Sorry, something went wrong at server level!"
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = {
    getItems,
    insertItem,
    updateItem,
    deleteItem
}

