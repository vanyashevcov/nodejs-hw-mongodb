import { typeList } from "../../constants/contacts.js";

const parseBoolean = value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
};

export const parseContactsFilterParams = ({ type, isFavourite }) => {
    const parsedIsFavourite = parseBoolean(isFavourite);

    const parsedType = typeList.includes(type) ? type : undefined;

    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};