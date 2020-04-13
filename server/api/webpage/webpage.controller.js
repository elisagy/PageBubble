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
// import Queue from 'bull';

// var webpagesQueue = new Queue('webpages transcoding', 'redis://127.0.0.1:6379');
// webpagesQueue.process(4, async (job, done) => {
//     // await new Promise(resolve => setTimeout(resolve, 1000));
//     var url = job.data.href,
//         prior24Hours = new Date();
//     prior24Hours.setTime(prior24Hours.getTime() - 24 * 60 * 60 * 1000);
//     if (await Webpage.findOne({ url , updatedAt: { $gt: prior24Hours } }).exec()) {
//         done();
//         return;
//     }
//     console.log(`Handling ${url}`);
//     Webpage.findOneAndUpdate({ url }, await getWebpageDataByURL(job.data.href), { projection: { _id: 0 }, new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
//         .then(done);
// });

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

async function getWebpageDataByURL(url) {
    try {

        var parsedURL = new URL(url),
            body = await new Promise((resolve, reject) => request({
                url,
                headers: {
                    'Host': parsedURL.host,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
                }
            }, (err, resp, body) => {
                return err && reject(err) || resolve(resp && resp.statusCode < 300 && body || '')
            }));

        if (!body) {
            return {};
        }

        var $ = cheerio.load(body),
            hrefs = [];
        $('a').each((i, link) => {
            var href = $(link).attr('href');
            if (!href) return;
            if (href.match(/^\//)) {
                if (href.match(/^\/\//)) {
                    href = (parsedURL.protocol || '') + href;
                } else {
                    href = (parsedURL.origin || '') + href;
                }
            } else if (!href.match(/^http/)) {
                return;
            }
            if (href !== url) {
                hrefs.push(href);
                // webpagesQueue.add({ href });
            }
        });
        var faviconUrl = ($('link[rel="shortcut icon"]')[0] || { attribs: {} }).attribs.href || ($('link[rel="alternate icon"]')[0] || { attribs: {} }).attribs.href;
        if (faviconUrl && !faviconUrl.match(/^http/)) {
            faviconUrl = (parsedURL.origin || '') + (faviconUrl.match(/^\//) ? '' : '/') + faviconUrl;
        }
        return { hrefs: _.uniq(hrefs), title: $('title').text(), faviconUrl };
    } catch (e) {
        console.log(e);
        return {};
    }
}

// Gets a list of Webpages
export function index(req, res) {
    return Webpage.find({}, { _id: 0, title: 1, url: 1, faviconUrl: 1, hrefs: 1, updatedAt: 1 }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Webpage from the DB
export function show(req, res) {
    return Webpage.findOne({ url: req.params.url }, { _id: 0, title: 1, url: 1, faviconUrl: 1, updatedAt: 1 }).exec()
        .then(handleEntityNotFound(res))
        .then(async entity => entity && Object.assign({}, entity._doc, { followingWebpages: await Webpage.find({ hrefs: { $in: [entity.url] } }, { _id: 0, title: 1, url: 1, faviconUrl: 1, updatedAt: 1 }).exec() }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Upserts the given Webpage in the DB at the specified ID
export async function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    req.body.url = req.params.url;
    Object.assign(req.body, await getWebpageDataByURL(req.body.url));
    return Webpage.findOneAndUpdate({ url: req.params.url }, req.body, { projection: { _id: 0, title: 1, url: 1, faviconUrl: 1, hrefs: 1, updatedAt: 1 }, new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Webpage from the DB
export function destroy(req, res) {
    return Webpage.findOne({ url: req.params.url }, { _id: 0 }).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
