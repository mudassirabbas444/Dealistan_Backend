import { productRouter } from "../mvc/routes/product/product.routes.js";
import { userRouter } from "../mvc/routes/user/user.routes.js";
import { categoryRouter } from "../mvc/routes/category/category.routes.js";
import { messageRouter } from "../mvc/routes/message/message.routes.js";
import { favoriteRouter } from "../mvc/routes/favorite/favorite.routes.js";
import uploadRouter from "../mvc/routes/upload/upload.routes.js";

export default(app)=>{
    app.use("/api/products",productRouter);
    app.use("/api/users",userRouter);
    app.use("/api/categories",categoryRouter);
    app.use("/api/messages",messageRouter);
    app.use("/api/favorites",favoriteRouter);
    app.use("/api/upload",uploadRouter);
}
