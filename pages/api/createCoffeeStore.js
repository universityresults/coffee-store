import { table, getMinifiedRecords, findRecordByFiltter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, street2, street, voting, imgUrl, address2 } = req.body;

    try {
      if (!id) {
        return res.status(400).json({ msg: "ID is missing" });
      }

      const records = await findRecordByFiltter(id);

      if (records.length !== 0) {
        res.json(records);
      } else {
        if (name) {
          const createRecords = await table.create([
            {
              fields: {
                id,
                name,
                address,
                address2,
                street,
                street2,
                voting: 0,
                imgUrl,
              },
            },
          ]);

          const records = getMinifiedRecords(createRecords);

          res.send({ records });
        } else {
          res.status(400).json({ msg: "ID or name is missing" });
        }
      }
    } catch (err) {
      console.error("Error finding store", err);
      res.status(500).json({ message: "Error finding store", err });
    }
  }
};

export default createCoffeeStore;
