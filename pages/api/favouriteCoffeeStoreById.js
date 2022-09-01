import { findRecordByFiltter, getMinifiedRecords, table } from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(400).json({ msg: "Invalid request method" });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "Id is missing" });
    }

    const records = await findRecordByFiltter(id);

    if (records.length === 0) {
      return res.status(404).json({ msg: "Coffee store id does not exist", id });
    }

    const record = records[0];

    const calculateVoting = parseInt(record.voting) + parseInt(1);

    const updateRecord = await table.update([
      {
        id: record.recordId,
        fields: {
          voting: calculateVoting,
        },
      },
    ]);

    if (!updateRecord) {
      return;
    }

    const minifiedRecords = getMinifiedRecords(updateRecord);

    res.json(minifiedRecords);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error upvoting coffee store", err });
  }
};

export default favouriteCoffeeStoreById;
