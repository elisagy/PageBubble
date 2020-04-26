import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { registerEvents } from './webpage.events';
import * as _ from 'lodash';

var Webpage,
    WebpageSchema = new mongoose.Schema({
    title: {
        type: String
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    faviconUrl: {
        type: String
    },
    hrefs: [{
        type: String,
        unique: true
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
    this.set('hrefs', _.uniq(this.get('hrefs')));
    var oldWebpage = await Webpage.findOne({ url: this.get('url') }, { _id: 0, hrefs: 1 });
    Webpage.updateMany({ url: { $in: _.difference(this && this.get('hrefs') || [], oldWebpage && oldWebpage.get('hrefs') || []) } }, { $inc: { quantity: +1, 'numberOfFollowingWebpages': 1 } }).exec();
    Webpage.updateMany({ url: { $in: _.difference(oldWebpage && oldWebpage.get('hrefs') || [], this && this.get('hrefs') || []) } }, { $inc: { quantity: -1, 'numberOfFollowingWebpages': 1 } }).exec();
    this.set('numberOfFollowingWebpages', await Webpage.count({ hrefs: { $in: [this.get('url')] } }).exec());
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
