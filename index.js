import express from "express"; 
import cors from "cors"; 
import UserRouter from "./src/controllers/user-controller.js"; 
import EventRouter from "./src/controllers/event-controller.js";
import EventLocationRouter from './src/controllers/event_location-controller.js';
import ProvinceRouter from "./src/controllers/province-controller.js";
import LocationRouter from "./src/controllers/location-controller.js";
import CategoryRouter from "./src/controllers/category-controller.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/user", UserRouter);
app.use("/api/event", EventRouter);
app.use("/api/event-location", EventLocationRouter)
app.use("/api/province", ProvinceRouter);
app.use("/api/location", LocationRouter);
app.use("/api/category", CategoryRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

