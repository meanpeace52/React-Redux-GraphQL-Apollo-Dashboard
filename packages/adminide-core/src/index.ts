export interface PersonType {
    name: string;
    id: string;
    sex: string;
    matches: [PersonType];
}

export interface SomeType {
    testInt: number;
    testFloat: number;
    fixedString: string;
}

export const STATUS_ACTIVE = 'STATUS_ACTIVE';
export const STATUS_DISABLED = 'STATUS_DISABLED';
export const STATUS_PENDING = 'STATUS_PENDING';
