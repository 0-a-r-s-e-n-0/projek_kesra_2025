const axios = require('axios');
const { faker } = require('@faker-js/faker');

const BASE_URL = 'http://localhost:8080/api/mails';
const TOTAL = 30;

async function generateAndSendMails(type = 'incoming') {
    for (let i = 1; i <= TOTAL; i++) {
        const mail_no = faker.string.alphanumeric(10).toUpperCase();
        const mail_file = faker.internet.url(); // atau path lokal jika disimpan
        const input_by_admin_id = '19632618-cc17-416e-ad40-e1d833c97b53'; // bisa diganti dengan UUID admin jika sudah ada

        try {
            const res = await axios.post(`${BASE_URL}/${type}`, {
                mail_no,
                mail_file,
                input_by_admin_id,
            });

            console.log(`[${type.toUpperCase()}] #${i} Success:`, res.data?.data?.mail_no || mail_no);
        } catch (err) {
            console.error(`[${type.toUpperCase()}] #${i} Failed:`, err.response?.data || err.message);
        }
    }
}

(async () => {
    console.log('Seeding Incoming Mails...');
    await generateAndSendMails('incoming');

    console.log('Seeding Outgoing Mails...');
    await generateAndSendMails('outgoing');

    console.log('✅ Done seeding 30 incoming & outgoing mails');
})();
