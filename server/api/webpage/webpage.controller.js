/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/webpages              ->  index
 * POST    /api/webpages              ->  create
 * GET     /api/webpages/:id          ->  show
 * PUT     /api/webpages/:id          ->  upsert
 * PATCH   /api/webpages/:id          ->  patch
 * DELETE  /api/webpages/:id          ->  destroy
 */

import Webpage from './webpage.model';

import request from 'request';
import cheerio from 'cheerio';
import * as _ from 'lodash';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

async function getUrlsByUrl(url) {
    var body = await new Promise((resolve, reject) => request(url, (err, resp, body) => err && reject(err) || resolve(body || ''))),
        $ = cheerio.load(body),
        urls = [],
        parsedUrl = new URL(url);
    $('a').each((i, link) => {
        var href = $(link).attr('href');
        if (!href) return;
        if (href.match(/^\//)) {
            if (href.match(/^\/\//)) {
                href = (parsedUrl.protocol || '') + href;
            }
            else {
                href = (parsedUrl.origin || '') + href;
            }
        }
        else if (!href.match(/^http/)) {
            return;
        }
        urls.push(href);
    });
    return _.uniq(urls);
}

// Gets a list of Webpages
export function index(req, res) {
    return Webpage.find({}, { _id: 0, url: 1, hrefs: 1, updatedAt: 1 }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Webpage from the DB
export function show(req, res) {
    return Webpage.findOne({ url: req.params.url }, { _id: 0, url: 1, hrefs: 1, updatedAt: 1 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Upserts the given Webpage in the DB at the specified ID
export async function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    req.body.url = req.params.url;
    req.body.hrefs = await getUrlsByUrl(req.body.url);
    return Webpage.findOneAndUpdate({ url: req.params.url }, req.body, { projection: { _id: 0, url: 1, hrefs: 1, updatedAt: 1 }, new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Webpage from the DB
export function destroy(req, res) {
    return Webpage.findOne({ url: req.params.url }, { _id: 0, url: 1, hrefs: 1, updatedAt: 1 }).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
