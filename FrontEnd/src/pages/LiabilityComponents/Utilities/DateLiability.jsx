import { format, parse } from 'date-fns';


export const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '';
};
export const convertDateToISO = (dateString) => {
    if (!dateString) return '';
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    return format(date, 'yyyy-MM-dd');
};