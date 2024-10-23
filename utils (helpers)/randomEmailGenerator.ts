import { v4 as uuidv4 } from 'uuid';

export default function generateRandomEmail(): string {
    const emailPrefix = 'anna.denisenkooo+aqa-test';
    const domain = 'gmail.com';
    const uuid = uuidv4().substr(0, 8); 
    return `${emailPrefix}${uuid}@${domain}`;
}