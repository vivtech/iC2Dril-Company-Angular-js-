export const environment = {
    production: true,
    apiUrl: "http://admin.ic2drill.techzarinfo.com/console",
    adminUrl: 'http://admin.ic2drill.techzarinfo.com',
    mobapiUrl: 'http://admin.ic2drill.techzarinfo.com/api/v1',
    validators: {
        name: { min: 3, max: 75 },
        email: { min: 3, max: 75 },
        company: { min: 3, max: 75 },
        phone: { min: 8, max: 15 },
        password: { min: 8, max: 16 },
        userCount: { minValue: 1, maxValue: 999, min: 1, max: 3 },
        notes: { min: 0, max: 300 },
        countryCode: { min: 1, max: 5 },
        countrySymbol: { min: 1, max: 5 },
        designation: { min: 3, max: 75 },
        camUrl: { min: 3, max: 200 },
        camUsername: { min: 3, max: 75 },
        camPassword: { min: 3, max: 75 }
    }
};
