import Box from '../documents/box';
import { STATUS_PENDING } from '../consts';

// export interface IBaseBoxData {
//     name: String;
//     description: String;
//     lang: String;
// }

export const getBoxesList = () => {
    return Box.find({}).exec();
};

export const createBox = (data) => {
    const box = new Box(data);
    return box.save()
        .then(() => box);
};

export const updateBox = (_id: string, data: any) => {
    return Box.update({ _id }, data, { strict: false })
        .exec()
        .then(() => Box.findOne({ _id }));
};


export const removeBox = (_id: String) => {
    return Box.findOne({ _id }).remove().exec();
};

export const setBoxStatus = (_id: String, status: String = STATUS_PENDING) => {
    return Box.update({ _id }, { status }, { strict: false })
        .exec()
        .then(() => Box.findOne({ _id }));
};

