import * as Mongoose from 'mongoose';
import { STATUS_DISABLED } from '../consts'; // TODO Move to @adminide-stack/core

const DEFAULT_RAM = 536870912;
const DEFAULT_HDD = 1073741824;
const DEFAULT_CPU = 1;

const specSchema = Mongoose.Schema({
    ram: { type:  Number, default: DEFAULT_RAM },
    hdd: { type: Number, default: DEFAULT_HDD },
    cpu: { type: Number, default: DEFAULT_CPU },
});

const boxSchema = Mongoose.Schema({
    name: { type: String, required: true },
    language: String,
    description: String,
    status: { type: String, default: STATUS_DISABLED },
    spec: { type: specSchema, default: { ram: DEFAULT_RAM, cpu: DEFAULT_CPU, hdd: DEFAULT_HDD } },
});

const boxModel = Mongoose.model('boxes', boxSchema);

export default boxModel;
