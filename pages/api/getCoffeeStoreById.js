import { table, getMinifiedRecords, findRecordByFiltter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ msg: "Id is missing" });
  }

  try {
    const records = await findRecordByFiltter(id);

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ meg: `id could not be found` });
    }
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", err });
  }
};

export default getCoffeeStoreById;
