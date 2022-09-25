import Mongoose from 'mongoose';
export { Mongoose };

export async function connect(): Promise<null> {
    Mongoose.connect(<string>process.env.MONGO_URI,
        {
            family: 4,
            keepAlive: true,
            keepAliveInitialDelay: 15000,
            serverSelectionTimeoutMS: 5000,
        }
    );

    return new Promise( (ok, fail) => Mongoose.connection.on('connected', () => ok(null) ) );
}

Mongoose.connection.on('error', err => {
    console.log(`MongoDB connection error: ${err}`);
});

Mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

Mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected');
});