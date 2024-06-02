export function capitalize(text: string) {
    if (!text) {
        return '';
    }

    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

export function convertToSlug(text: string) {
    const regex =  /[A-Za-z][a-z0-9]*/g;

    if (!text || !regex.test(text)) {
        return '';
    }

    return text.match(regex)?.reduce((slug, token, index) => {
        return slug + (index !== 0 ? '-' : '') + token.toLowerCase();
    }, '') ?? '';
}

export function convertFromSlug(text: string) {
    if (!text) {
        return '';
    }

    return text.split('-').reduce((result, token) => {
        return result + capitalize(token);
    }, '');
}