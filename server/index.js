const express = require("express");
const app = express();
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const morgan = require("morgan")

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors({ origin: "http://localhost:5173" })); 

function Middleware(req, res, next){
    console.log("This is a custom middleware");
    next();
}

// app.use(Middleware);

app.get("/", Middleware, async (req, res) => {
  //Data from Frontend[optional]

  //DB Logic
  try {
    const allData = await prisma.user2.findMany();

    //Data to Frontend
    res.status(200).json({ message: "Got all data", data: allData });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id", (req, res) => {
  try {
    //Data from Fronted
    const userReq = req.params;

    //DB Logic
    const userData = prisma.user2.findUnique({
      where: {
        id: userReq.id,
      },
    });

    //Data to Frontend
    res.status(200).json({ message: "Got user using params", data: userData });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    //Data from Frontend
    const userTable = req.body;

    //DB Logic
    const newUser = await prisma.user2.create({
      data: {
        id: userTable.id,
        name: userTable.name,
      },
    });

    //Data to Frontend
    res.json({ message: "User added", data: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/:id", async (req, res) => {

  try {
    //Data from frontend
    const userTable = req.body;

    const userId = req.params;

    //DB Logic
    const updatedUser = await prisma.user2.update({
      where: {
        id: userId.id,
      },
      data: {
        id: userTable.id,
        name: userTable.name,
      },
    });

    //Data to backend
    res.json({ message: "User updated", data: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

//Using middleware for specific endpoint
// app.put("/:id", express.json(), async (req, res) => {
//     try {
//       //Data from frontend
//       const userTable = req.body;
  
//       const userId = req.params;
  
//       //DB Logic
//       const updatedUser = await prisma.user2.update({
//         where: {
//           id: userId.id,
//         },
//         data: {
//           id: userTable.id,
//           name: userTable.name,
//         },
//       });
  
//       //Data to backend
//       res.json({ message: "User updated", data: updatedUser });
//     } catch (err) {
//       console.log(err);
//       res.status(500).send("Internal Server Error");
//     }
// });

app.delete("/remove", async (req, res) => {
  try {
    //Data from frontend
    const userTable = req.body;

    //DB Logic
    await prisma.user2.delete({
      where: {
        id: userTable.id,
      },
    });

    //Data to frontend
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

//Data from headers

app.get("/user/:id", (req, res) => {
  try {
    const data = req.headers;
    console.log(data);
    res.json({ message: "Got data from headers", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Query-based endpoint to get users by query parameters
app.get("/users", async (req, res) => {
  try {
    //Data from Frontend
    const { name } = req.query;

    //DB Logic

    const users = await prisma.user2.findMany({
      where: {
        ...(name && { name }),
      },
    });

    //Data to Frontend

    res.json({ message: "Got users based on query parameters", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

