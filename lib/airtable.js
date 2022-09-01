const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY);
const table = base("coffee-stores");

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const getMinifiedRecord = (record) => {
  return {
    ...record.fields,
    recordId: record.id,
  };
};

const findRecordByFiltter = async (id) => {
  const findCoffeeStoreRecoreds = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecoreds);
};

export { table, getMinifiedRecords, findRecordByFiltter };
