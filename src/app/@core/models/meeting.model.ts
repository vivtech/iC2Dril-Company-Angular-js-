export interface Meeting {
    _id?: string;
    title: string;
    desc?: string;
    startTime?: string;
    endTime?: number;
    attenders: any;
    active: any;
    status: any;
}