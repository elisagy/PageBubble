/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import User from '../api/user/user.model';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
    if(!config.seedDB) {
        return Promise.resolve();
    }


    let promises = [];

    let userPromise = User.find({}).remove()
        .then(() => User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@example.com',
            password: 'test'
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin'
        })
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err)));
    promises.push(userPromise);

    return Promise.all(promises);
}
