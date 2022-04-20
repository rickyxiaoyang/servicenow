import got from "got";
import "dotenv/config";
import fs, { createWriteStream } from "fs";

async function getPDFWithId(id) {
    try {
        const url = `https://apps.fcc.gov/formsPrint?reference_number=${id}&FCC_Identifier=NY0320&appType=CL`;
        await got.stream(url).pipe(createWriteStream("output.pdf"));
    } catch (e) {
        console.error(`error when getting pdf from fcc`);
    }
}

async function sendAttachment(fileName, table, sys_id) {
    const url = "https://dev101454.service-now.com/api";
    const endpoint = "/now/attachment/file?";
    const query = `table_name=${table}&table_sys_id=${sys_id}&file_name=${fileName}`;
    const httpHeaders = {
        Accept: "application/json",
        "Content-Type": "application/pdf",
    };
    try {
        const pdf = await fs.readFileSync(`${fileName}`);
        await got.post(`${url}${endpoint}${query}`, {
            body: pdf,
            headers: httpHeaders,
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD,
            isStream: true,
        });
    } catch (e) {
        console.error(`Error when sending attachment`);
    }
}
const file_name = "output.pdf";
const sys_id = "9fffc328731823002728660c4cf6a742";
const table = "incident";
const fcc_attachment_id = 338822317;

try {
    await getPDFWithId(fcc_attachment_id);
    setTimeout(async () => {
        await sendAttachment(file_name, table, sys_id);
    }, 1000);
    console.log(`Successfully uploaded attachment.`);
} catch (e) {
    console.error("Error when uploading attachments");
}
