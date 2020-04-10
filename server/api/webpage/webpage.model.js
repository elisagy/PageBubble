import mongoose from 'mongoose';
require('mongoose-type-url');
import timestamps from 'mongoose-timestamp';
import { registerEvents } from './webpage.events';

var WebpageSchema = new mongoose.Schema({
    title: {
        type: String
    },
    url: {
        type: mongoose.SchemaTypes.Url,
        required: 'Must be a Valid URL',
        unique: true
    },
    hrefs: [{
        type: mongoose.SchemaTypes.Url,
        required: 'Must be a Valid URL',
        unique: true
    }],
    active: {
        type: Boolean,
        default: true,
        required: true
    }
}, { autoIndex: false });

WebpageSchema.plugin(timestamps);
WebpageSchema.index({ url: 1, type: -1 });
WebpageSchema.index({ hrefs: 1, type: -1 });
registerEvents(WebpageSchema);
export default mongoose.model('Webpage', WebpageSchema);
