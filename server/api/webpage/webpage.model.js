import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { registerEvents } from './webpage.events';
import * as _ from 'lodash';

var Webpage,
    WebpageSchema = new mongoose.Schema({
        title: [{
            // name: String,
            // reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        }],
        url: {
            type: String,
            required: true,
            unique: true
        },
        faviconUrl: {
            type: String
        },
        origin: {
            type: String,
            required: true
        },
        hrefs: [{
            // url: String,
            // reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }],
        numberOfFollowingWebpages: {
            type: Number,
            default: 0,
            required: true
        },
        active: {
            type: Boolean,
            default: true,
            required: true
        }
    }, { autoIndex: false });

async function pre(next) {
    var oldWebpage = await Webpage.findOne({ url: this.get('url') }, { _id: 0, hrefs: 1 });
    Webpage.updateMany({ url: { $in: _.difference((this && this.get('hrefs') || []).map(href => href.url), (oldWebpage && oldWebpage.get('hrefs') || []).map(href => href.url)) } }, { $inc: { quantity: +1, 'numberOfFollowingWebpages': 1 } }).exec();
    Webpage.updateMany({ url: { $in: _.difference((oldWebpage && oldWebpage.get('hrefs') || []).map(href => href.url), (this && this.get('hrefs') || []).map(href => href.url)) } }, { $inc: { quantity: -1, 'numberOfFollowingWebpages': 1 } }).exec();
    this.set('numberOfFollowingWebpages', await Webpage.count({ hrefs: { $elemMatch: { url: this.get('url') } } }).exec());
    next();
}

WebpageSchema.pre('findOneAndUpdate', pre);
WebpageSchema.pre('save', pre);

WebpageSchema.plugin(timestamps);
WebpageSchema.index({ url: 1, type: -1 });
WebpageSchema.index({ hrefs: 1, type: -1 });
registerEvents(WebpageSchema);
Webpage = mongoose.model('Webpage', WebpageSchema);
export default Webpage;
